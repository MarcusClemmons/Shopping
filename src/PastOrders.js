import React, { useState, useEffect } from 'react';
import './PastOrders.css';

function PastOrders() {
    const [pastOrders, setPastOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPastOrders = async () => {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token"); // Assuming you're using Firebase Auth tokens for secure access

            if (!userId) return;

            const ordersUrl = `https://shopping-c66b2-default-rtdb.firebaseio.com/orders.json?auth=${token}`;

            try {
                const response = await fetch(ordersUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const fetchedOrders = [];

                for (const key in data) {
                    if (data[key].userId === userId) {
                        fetchedOrders.push({
                            id: key,
                            ...data[key]
                        });
                    }
                }

                setPastOrders(fetchedOrders);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching past orders:", error);
                setLoading(false);
            }
        };

        fetchPastOrders();
    }, []);

    if (loading) {
        return <div>Loading past orders...</div>;
    }

    return (
        <div className="past-orders-page">
            <h1>Your Past Orders</h1>
            {pastOrders.length > 0 ? (
                pastOrders.map((order, index) => (
                    <div key={index} className="past-order-item">
                        <h3>{order.items.map(item => `Product Name: ${item.name}`).join(", ")}</h3>
                        <p>Total Price: ${order.totalPrice}</p>
                        <p>Address: {order.address}</p>
                        <p>Status: {order.status}</p>
                    </div>
                ))
            ) : (
                <p>You have no past orders.</p>
            )}
        </div>
    );
}

export default PastOrders;
