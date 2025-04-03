import React, { useState } from "react";
import { Card, Input, Modal, Typography, Divider, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { db } from "../../firebase-config";
import { updateDoc, doc } from "@firebase/firestore";

const { Title, Text } = Typography;

const MessMenuCard = ({ id, day, breakfast, lunch, snacks, dinner }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState("");
    const [selectedField, setSelectedField] = useState("");
    const [newValue, setNewValue] = useState("");

    // Open modal for editing specific field
    const openModal = (mealType, field, currentValue) => {
        setSelectedMealType(mealType);
        setSelectedField(field);
        setNewValue(currentValue);
        setModalVisible(true);
    };

    // Update Firestore document
    const updateMenu = async () => {
        if (!newValue.trim()) return; // Prevent empty updates
        const mealPath = `${selectedMealType}.${selectedField}`;
        await updateDoc(doc(db, "messMenu", id), { [mealPath]: newValue });
        setModalVisible(false);
        setTimeout(() => window.location.reload(), 500);
    };

    // Function to render meal items with better UI
    const renderMeal = (meal, mealType, label, icon) => (
        <Card
            className="mb-4 shadow-md border border-green-300 dark:border-green-600"
            title={
                <Text className="font-bold text-green-900 dark:text-green-300 flex items-center">
                    {icon} {label}
                </Text>
            }
        >
            {Object.entries(meal || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center mb-2">
                    <Text className="capitalize text-gray-700 dark:text-gray-300 flex items-center">
                        {key === "main" ? "🍛" : 
                         key === "sides" ? "🥘" : 
                         key === "extras" ? "✨" : 
                         key === "fruits" ? "🍎" : 
                         key === "salad" ? "🥗" : 
                         key === "sweets" ? "🍮" : 
                         key === "drinks" ? "🥤" : ""}{" "}
                        {value}
                    </Text>
                    <Tooltip title="Edit">
                        <EditOutlined
                            className="ml-2 text-green-700 cursor-pointer"
                            onClick={() => openModal(mealType, key, value)}
                        />
                    </Tooltip>
                </div>
            ))}
        </Card>
    );

    return (
        <Card className="bg-green-50 dark:bg-green-900 shadow-lg border-2 border-green-400 dark:border-green-600">
            {/* Day Header */}
            <Title level={4} className="text-center text-green-900 dark:text-green-300 font-extrabold">
                📅 {day}
            </Title>
            <Divider className="border-green-500" />

            {/* Meal Sections */}
            {renderMeal(breakfast, "breakfast", "Breakfast", "🌞")}
            {renderMeal(lunch, "lunch", "Lunch", "🍱")}
            {renderMeal(snacks, "snacks", "Snacks", "🍪")}
            {renderMeal(dinner, "dinner", "Dinner", "🌙")}

            {/* Edit Modal */}
            <Modal
                title={`Update ${selectedField} for ${selectedMealType}`}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={updateMenu}
                okText="Update"
                okButtonProps={{ className: "bg-green-600 hover:bg-green-500 text-white" }}
            >
                <Text className="block mb-2 text-gray-700">Edit {selectedField}:</Text>
                <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder={`Enter new ${selectedField}`}
                />
            </Modal>
        </Card>
    );
};

export default MessMenuCard;
