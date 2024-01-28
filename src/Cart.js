import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState("");

    useEffect(() => {
        const fetchCartItems = async () => {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
    
            if (!userId || !token) {
                setLoading(false);
                return;
            }
    
            try {
                const userDocUrl = `https://firestore.googleapis.com/v1/projects/shopping-c66b2/databases/(default)/documents/users/${userId}`;
                const response = await fetch(userDocUrl, {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch cart data");
                }
    
                const data = await response.json();
                const cartData = data.fields.cart?.arrayValue?.values || [];
    
                const productQuantities = new Map();
    
                for (let item of cartData) {
                    const productFields = item.mapValue?.fields;
                    if (!productFields) continue;
    
                    const productId = parseInt(productFields.productId?.integerValue, 10);
                    if (isNaN(productId)) continue;
    
                    const quantity = parseInt(productFields.quantity?.integerValue, 10) || 1;
                    const name = productFields.name?.stringValue || 'Unknown';
                    const price = parseInt(productFields.price?.integerValue, 10) || 0;
    
                    if (!productQuantities.has(productId)) {
                        productQuantities.set(productId, {
                            name,
                            price,
                            quantity,
                            productId
                        });
                    } else {
                        const currentQuantity = productQuantities.get(productId).quantity;
                        productQuantities.get(productId).quantity = currentQuantity + quantity;
                    }
                }
    
                setCartItems(Array.from(productQuantities.values()));
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
    
            setLoading(false);
        };
    
        fetchCartItems();
    }, []);
    
    

    useEffect(() => {
        // Calculate the total amount
        const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotalAmount(total);
    }, [cartItems]);

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            console.error("Quantity cannot be less than 1");
            return;
        }

        // Update quantity in Realtime Database
        const userId = localStorage.getItem("userId");
        const summaryUrl = `https://shopping-c66b2-default-rtdb.firebaseio.com/productSummary/${userId}/${productId}.json`;

        try {
            const updateResponse = await fetch(summaryUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (!updateResponse.ok) {
                throw new Error(`HTTP error! status: ${updateResponse.status}`);
            }

            // Update quantity in the state
            setCartItems(
                cartItems.map((item) =>
                    item.productId === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating product quantity:", error);
        }
    };

    const deleteProduct = async (productId) => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        try {
            // Fetch the current cart from Firestore
            const userDocUrl = `https://firestore.googleapis.com/v1/projects/shopping-c66b2/databases/(default)/documents/users/${userId}`;
            const userDocResponse = await fetch(userDocUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!userDocResponse.ok) {
                throw new Error("Failed to fetch user document");
            }

            const userDocData = await userDocResponse.json();
            const currentCart = userDocData.fields.cart?.arrayValue?.values || [];

            // Filter out the deleted product
            const updatedCart = currentCart.filter(item => parseInt(item.mapValue.fields.productId.integerValue, 10) !== productId);

            // Update Firestore cart
            await fetch(`${userDocUrl}?updateMask.fieldPaths=cart`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fields: {
                        cart: { arrayValue: { values: updatedCart } }
                    }
                })
            });

            // Delete from Realtime Database product summary
            const summaryUrl = `https://shopping-c66b2-default-rtdb.firebaseio.com/productSummary/${userId}/${productId}.json`;
            await fetch(summaryUrl, { method: "DELETE" });

            // Update local state
            setCartItems(cartItems.filter(item => item.productId !== productId));
            setTotalAmount(cartItems.reduce((acc, item) => item.productId !== productId ? acc + (item.price * item.quantity) : acc, 0));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };
    const checkout = async (event) => {
        event.preventDefault();
    

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
    
        if (!userId || !token || !address) {
            alert("Please complete all fields.");
            return;
        }
    
        try {
            // Generate a unique orderId using timestamp and userId
            const orderId = `order_${Date.now()}_${userId}`;
    
            // Order items structure
            const orderItems = cartItems.map(item => ({
                productId: item.productId.toString(),
                name: item.name,
                price: item.price.toString(),
                quantity: item.quantity.toString()
            }));
    
            // Prepare order data for Firebase Realtime Database
            const orderData = {
                orderId: orderId,
                userId: userId,
                items: orderItems,
                totalPrice: totalAmount.toString(),
                address: address,
                status: "shipped"
            };
    
            // Save the order to Firebase Realtime Database
            const ordersUrl = `https://shopping-c66b2-default-rtdb.firebaseio.com/orders.json?auth=${token}`;
            const orderResponse = await fetch(ordersUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
    
            if (!orderResponse.ok) {
                throw new Error(`HTTP error! status: ${orderResponse.status}`);
            }
    
            // Clear the user's cart in Firestore
            const clearCartUrl = `https://firestore.googleapis.com/v1/projects/shopping-c66b2/databases/(default)/documents/users/${userId}`;
            await fetch(clearCartUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fields: {
                        cart: { arrayValue: { values: [] } }
                    }
                })
            });
    
            // Clear the product summary in Realtime Database
            for (let item of cartItems) {
                const summaryUrl = `https://shopping-c66b2-default-rtdb.firebaseio.com/productSummary/${userId}/${item.productId}.json`;
                await fetch(summaryUrl, { method: 'DELETE' });
            }
    
            // Update local state and navigate to PastOrders
            setCartItems([]);
            setTotalAmount(0);
            // Assuming you are using React Router for navigation
            // navigate('/past-orders'); // Uncomment and use the navigate function from react-router-dom
    
            alert("Order placed successfully!");
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("Failed to place the order.");
        }
    };

    return (
        <div className="main-cart">
            <Link to="/past-orders" className="view-past-orders-link">
                View your past orders
            </Link>

            <div className="cart-items">
                <h1>Your Current Cart</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <div className="product-item" key={index}>
                                <h3>{item.name}</h3>
                                <p>${item.price}</p>
                                <button onClick={() => deleteProduct(item.productId)}>Delete</button>
                            </div>
                        ))
                    ) : (
                        <p>Your cart is empty.</p>
                    )
                )}
            </div>

            <div className="product-summary">
                <h2>Product Summary</h2>
                {cartItems.map((item, index) => (
                    <div key={index} className="product-summary-item">
                        <p>
                            {item.name} - ${item.price} x 
                            <input
                                className="updateQuantity"
                                type="number"
                                value={item.quantity}
                                min={1}
                                onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                            />
                        </p>
                    </div>
                ))}
                <p className="total-amount">Total: ${totalAmount}</p>
                <form onSubmit={checkout}>
                    <input type="text" name="name" placeholder="Enter Your name" />
                    <input 
                      type="text" 
                      placeholder="Enter Your Address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)} 
                    />
                    <button type="submit" className="checkOut">
                        Checkout
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Cart;