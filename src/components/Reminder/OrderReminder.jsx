import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase-config";
import SendOrderMail from "./SendOrderMail";
import { Spin } from "antd";

function OrderReminder() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        try {
            const inventoryRef = collection(db, "inventory");
            const data = await getDocs(inventoryRef);
            const filteredProducts = data.docs
                .map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }))
                .filter((product) => product.quantity <= 10); // Only show products with low stock
            
            setProducts(filteredProducts);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="pt-20 px-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                ⚠ Urgent Stock Refill Needed
            </h2>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <Spin size="large" />
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <SendOrderMail
                            key={product.id}
                            id={product.id}
                            productName={product.productName}
                            quantity={product.quantity}
                            category={product.category}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center">✅ All stocks are sufficient. No urgent orders needed.</p>
            )}
        </div>
    );
}

export default OrderReminder;
