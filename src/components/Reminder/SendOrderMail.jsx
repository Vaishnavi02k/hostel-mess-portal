import { Form, Button, Input, Modal, Tag, Spin } from "antd";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebase-config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendOrderMail = ({ id, productName, quantity, category }) => {
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Define urgency levels & styles
    const getUrgencyDetails = () => {
        if (quantity < 5) {
            return {
                tag: <Tag color="red">🔥 High Urgency</Tag>,
                border: "border-red-500",
                bg: "bg-red-50 dark:bg-red-900",
                text: "text-red-700 dark:text-red-300",
                btnBg: "bg-red-600 hover:bg-red-700",
                focusRing: "focus:ring-red-400",
                alert: `🚨 Critical Alert: Only ${quantity} ${category} left! Immediate restocking is URGENT.`,
            };
        }
        if (quantity <= 10) {
            return {
                tag: <Tag color="gold">⚠️ Medium Urgency</Tag>,
                border: "border-yellow-500",
                bg: "bg-yellow-50 dark:bg-yellow-900",
                text: "text-yellow-700 dark:text-yellow-300",
                btnBg: "bg-yellow-600 hover:bg-yellow-700",
                focusRing: "focus:ring-yellow-400",
                alert: `⚠️ Low Stock Warning: Just ${quantity} ${category} remaining. Restock soon to avoid shortages.`,
            };
        }
        return {
            tag: <Tag color="green">✅ Low Urgency</Tag>,
            border: "border-green-500",
            bg: "bg-green-50 dark:bg-green-900",
            text: "text-green-700 dark:text-green-300",
            btnBg: "bg-green-600 hover:bg-green-700",
            focusRing: "focus:ring-green-400",
            alert: `✅ Stock Check: You have ${quantity} ${category} in stock. Keep monitoring for future needs.`,
        };
    };

    const { tag, border, bg, text, btnBg, focusRing, alert } = getUrgencyDetails();

    const updateProductQuantity = async (id, orderQuantity) => {
        try {
            setLoading(true);
            if (!id || !orderQuantity || orderQuantity <= 0) {
                throw new Error("Invalid input: Please enter a valid quantity.");
            }

            const currDoc = doc(db, "inventory", id);
            const docSnap = await getDoc(currDoc);

            if (!docSnap.exists()) {
                throw new Error("Document not found");
            }

            const prevQuantity = Number(docSnap.data()?.quantity || 0);
            const newQuantity = prevQuantity + Number(orderQuantity);

            await updateDoc(currDoc, { quantity: newQuantity });

            toast.success(`Order for ${newQuantity-prevQuantity} ${category} placed successfully!`, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });

            console.log(`Product ${id} quantity updated to ${newQuantity}`);
        } catch (error) {
            console.error("Error updating product quantity:", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
            setIsPlacingOrder(false);
            setTimeout(() => window.location.reload(), 2000);
        }
    };

    const handleSubmit = async (values) => {
        console.log("Order Placed!", values);
        await updateProductQuantity(id, values.quantity);
    };

    return (
        <div className="p-4">
            <ToastContainer />

            {/* Order Card with Dynamic Colors */}
            <div className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full p-5 border ${border} ${bg} flex flex-col`}>
                <div className="text-gray-900 dark:text-white">
                    <h3 className="text-lg font-bold flex items-center">🥗 {productName}</h3>

                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-2">
                        Current stock: <span className={`font-bold ${text}`}>{quantity} {category}</span>
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{alert}</p>

                    {/* Order Button */}
                    <button
                        className={`mt-4 w-full px-6 py-2 font-bold rounded-lg transition-all ${btnBg} text-white focus:outline-none focus:ring-2 ${focusRing}`}
                        onClick={() => setIsPlacingOrder(true)}
                    >
                        Place Order
                    </button>
                </div>
            </div>

            {/* Modal Form */}
            <Modal
                title={<h2 className="text-lg font-bold">{`Order ${productName} (${category})`}</h2>}
                open={isPlacingOrder}
                onCancel={() => setIsPlacingOrder(false)}
                footer={null}
                centered
                width={350}
            >
                <Form
                    form={form}
                    name="order_form"
                    className="flex flex-col gap-4"
                    onFinish={handleSubmit}
                    initialValues={{ quantity: "" }}
                >
                    <p className="text-gray-600 dark:text-gray-400">
                        Available: <span className={`font-medium ${text}`}>{quantity} {category}</span>
                    </p>

                    <Form.Item
                        name="quantity"
                        label="Order Quantity"
                        rules={[{ required: true, message: "Please enter a valid quantity" }]}
                    >
                        <Input type="number" suffix={category} className="border border-gray-400" min={1} />
                    </Form.Item>

                    <Form.Item className="flex justify-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={`w-40 flex items-center justify-center ${btnBg}`}
                            disabled={loading}
                        >
                            {loading ? <Spin size="small" className="mr-2" /> : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SendOrderMail;
