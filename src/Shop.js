import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import Card from './Card';
import classes from './Card.module.css';

function Shop() {
    const [products, setProducts] = useState([]);
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://firestore.googleapis.com/v1/projects/ecommerce-app-c5530/databases/(default)/documents/products');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
    
                if (!data.documents) {
                    throw new Error('No documents found in the response');
                }
    
                const fetchedProducts = data.documents.map(doc => {
                    const fields = doc.fields;
                    return {
                        id: doc.name.split('/').pop(),
                        name: fields.name.stringValue,
                        imageURL: fields.imageURL.stringValue,
                        price: parseInt(fields.price.stringValue, 10), // Convert string to integer
                        description: fields.description.stringValue,
                        productId: parseInt(fields.productId.integerValue, 10) // Convert string to integer
                    };
                });
    
                console.log('Fetched products:', fetchedProducts); // Debugging log
                setProducts(fetchedProducts);
    
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
    
        fetchProducts();
    }, []);
    
    const handleAddToCart = async (product) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        if (!userId || !token) {
            alert("Please log in to add products to your cart.");
            return;
        }
    
        try {
            // Fetch user's cart from Firestore
            const userDocUrl = `https://firestore.googleapis.com/v1/projects/ecommerce-app-c5530/databases/(default)/documents/users/${userId}`;
            const userDocResponse = await fetch(userDocUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!userDocResponse.ok) {
                throw new Error(`Error fetching user document: ${userDocResponse.status}`);
            }
    
            const userDocData = await userDocResponse.json();
            let userData = userDocData.fields;
    
            // Prepare the product to add
            const productToAdd = {
                mapValue: {
                    fields: {
                        productId: { integerValue: product.productId.toString() },
                        name: { stringValue: product.name },
                        price: { integerValue: product.price.toString() },
                      
                    }
                }
            };
    
            // Update the cart field
            let cartArray = userData.cart && userData.cart.arrayValue.values
                ? [...userData.cart.arrayValue.values, productToAdd]
                : [productToAdd];
    
            // Prepare the updated user data
            const updatedUserData = {
                ...userData,
                cart: {
                    arrayValue: {
                        values: cartArray
                    }
                }
            };
    
            // Update user's cart in Firestore
            const updateResponse = await fetch(`${userDocUrl}?updateMask.fieldPaths=cart`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ fields: updatedUserData })
            });
    
            if (!updateResponse.ok) {
                throw new Error(`Error updating user document: ${updateResponse.status}`);
            } else {
                alert("Product added to cart");
            }
    
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };
    


    
    

    const buy = products.map((product) => (
        <React.Fragment key={product.id}> {/* Unique key for each fragment */}
            <h1>{product.name}</h1>
            <Card className={classes.card}>
                <img src={product.imageURL} alt={product.name} />
                <p>${product.price}</p>
                <p>{product.description}</p>
                <button onClick={() => handleAddToCart(product)}>Add To Cart</button>
            </Card>
        </React.Fragment>
    ));
    

    return (
        <div className="products">
            <h1>Enjoy Your Shopping</h1>
            <button>Go to Cart</button>
            {buy}
        </div>
    );
}

export default Shop;
