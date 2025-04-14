import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Import CSS
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { Card, Col, Row, Typography } from "antd";
import {
    CoffeeOutlined,           // ☕ — Breakfast
    FieldTimeOutlined,        // 🕛 — Lunch (midday feel)
    PieChartOutlined,         // 🥧 — Snacks (small treat)
    RestOutlined              // 🌙 — Dinner (nighttime/rest)
} from "@ant-design/icons";

const { Title, Text } = Typography;

function Dashboard() {
    const [meals, setMeals] = useState({
        breakfast: null,
        lunch: null,
        snacks: null,
        dinner: null,
    });
    const [loading, setLoading] = useState(true);
    const [activeMeal, setActiveMeal] = useState('');

    const userCollectionRef = collection(db, "messMenu");

    const mealIcons = {
        breakfast: <CoffeeOutlined style={{ fontSize: "22px", color: "fff" }} />,
        lunch: <FieldTimeOutlined style={{ fontSize: "22px", color: "#000" }} />,
        snacks: <PieChartOutlined style={{ fontSize: "22px", color: "#000" }} />,
        dinner: <RestOutlined style={{ fontSize: "22px", color: "000" }} />,
    };

    const MealItem = ({ title, meal }) => (
        <Card className="grid-item meal"
            title={
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {mealIcons[title]} <span>{title.charAt(0).toUpperCase() + title.slice(1)}</span>
                </div>
            }
            bordered={false} style={{ width: 300, margin: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            {meal &&
                Object.keys(meal).map((key) =>
                    meal[key] ? (
                        <Text key={key} style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>
                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {meal[key]}
                        </Text>
                    ) : null
                )}
        </Card>
    );

    const ActiveMeal = ({ activeMealData, title }) => {
        if (!activeMealData) return null;

        const entries = Object.entries(activeMealData).filter(([_, value]) => value);

        return (
            <Card className="grid-item meal active"
                title={
                    <span style={{ color: "#fff" }}>
                        {mealIcons[title]} {title.toUpperCase()}
                    </span>
                }>
                <Row gutter={[2, 2]}>
                    {entries.map(([key, value], index) => (
                        <Col key={key} span={12}>
                            <p>
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                            </p>
                        </Col>
                    ))}
                </Row>
            </Card>
        );
    };

    const updateActiveMeal = () => {
        const currentHour = new Date().getHours();
        if (currentHour >= 7 && currentHour < 12) {
            setActiveMeal("breakfast");
        } else if (currentHour >= 12 && currentHour < 16) {
            setActiveMeal("lunch");
        } else if (currentHour >= 16 && currentHour < 19) {
            setActiveMeal("snacks");
        } else {
            setActiveMeal("dinner");
        }
    };

    useEffect(() => {
        updateActiveMeal();

        const fetchMenu = async () => {
            try {
                setLoading(true);
                const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

                const menuQuery = query(collection(db, "messMenu"), where("day", "==", today));
                const querySnapshot = await getDocs(menuQuery);

                if (!querySnapshot.empty) {
                    const menuData = querySnapshot.docs[0].data();

                    setMeals({
                        breakfast: menuData.breakfast,
                        lunch: menuData.lunch,
                        snacks: menuData.snacks,
                        dinner: menuData.dinner,
                    });
                } else {
                    console.error(`No menu found for ${today}`);
                }
            } catch (error) {
                console.error("Error fetching menu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="mess-menu-wrapper">
            <div className="mess-menu-grid">
                <div className="grid-item student-count">
                    <h2>Student&apos;s Count</h2>
                    <p>20</p>
                </div>

                <div className="meal-section">
                    {activeMeal && <ActiveMeal activeMealData={meals[activeMeal]} title={activeMeal} />}

                    <div className="meal-row">
                        {Object.keys(meals).map((mealType) =>
                            activeMeal !== mealType ? <MealItem key={mealType} title={mealType} meal={meals[mealType]} /> : null
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
