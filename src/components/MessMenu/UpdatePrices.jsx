import React, { useEffect, useState } from "react";
import { Card, Typography, InputNumber, Button, Space } from "antd";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

function UpdatePrices() {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false); // Track if editing is enabled

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "messPrices"));
                const mealPrices = [];
                querySnapshot.forEach((doc) => {
                    mealPrices.push({ id: doc.id, ...doc.data() });
                });
                setPrices(mealPrices);
            } catch (error) {
                toast.error("Failed to load current prices.");
                console.error(error);
            }
        };

        fetchPrices();
    }, []);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            // Loop through the prices array and update each document
            for (const price of prices) {
                await updateDoc(doc(db, "messPrices", price.id), {
                    price: price.price,
                });
            }

            toast.success("Prices updated successfully!");
            setEditing(false); // Disable editing after successful update
        } catch (error) {
            toast.error("Failed to update prices.");
            console.error(error);
        }
        setLoading(false);
    };

    const handleChange = (id, value) => {
        setPrices((prev) =>
            prev.map((price) =>
                price.id === id ? { ...price, price: value } : price
            )
        );
    };

    return (
        <Card
            title="Update Meal Prices"
            className=" flex justify-center mx-auto mt-10 p-4 shadow-md bg-green-200"
        >
            <Space direction="horizontal" size="middle" style={{ width: "100%" }}>
                {prices.map((meal) => (
                    <div key={meal.id} className="flex items-center space-x-4">
                        <Text strong className="text-green-700">
                            {meal.id.charAt(0).toUpperCase() + meal.id.slice(1)}:
                        </Text>
                        <InputNumber
                            value={meal.price}
                            min={0}
                            className="w-24"
                            onChange={(value) => handleChange(meal.id, value)}
                            disabled={!editing} // Disable input if not editing
                            style={{ width: "80px" }}
                        />
                    </div>
                ))}

                {/* <div className="flex justify-center mt-4"> */}
                {!editing ? (
                    <Button
                        type="primary"
                        className="w-full"
                        onClick={() => setEditing(true)} // Enable editing
                    >
                        Edit Prices
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        className="w-full"
                        onClick={handleUpdate}
                        loading={loading}
                    >
                        Save Updated Prices
                    </Button>
                )}
            </Space>
            {/* </div> */}
            <ToastContainer />
        </Card>
    );
}

export default UpdatePrices;
