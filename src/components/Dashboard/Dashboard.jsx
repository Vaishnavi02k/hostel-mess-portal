import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Import CSS
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { Card, Col, Row, Typography } from "antd";
import { CoffeeOutlined, SmileOutlined, FireOutlined, ForkOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;



function Dashboard() {
    // const [breakfast, setBreakfast] = useState('Poha & Tea');
    // const [lunch, setLunch] = useState('Dal, Rice & Sabji');
    // const [snacks, setSnacks] = useState('Samosa & Chai');
    // const [dinner, setDinner] = useState('Roti, Paneer & Salad');
    const [breakfast, setBreakfast] = useState(null);
    const [lunch, setLunch] = useState(null);
    const [snacks, setSnacks] = useState(null);
    const [dinner, setDinner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMeal, setActiveMeal] = useState('');
    const userCollectionRef = collection(db, "messMenu");

    const mealIcons = {
        Breakfast: <CoffeeOutlined style={{ fontSize: "22px", color: "#000" }} />,
        Lunch: <SmileOutlined style={{ fontSize: "22px", color: "#000" }} />,
        Snacks: <FireOutlined style={{ fontSize: "22px", color: "#000" }} />,
        Dinner: <ForkOutlined style={{ fontSize: "22px", color: "#000" }} />
    };

    const MealItem = ({ title, meal }) => (
        <Card className="grid-item meal"
            title={
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {mealIcons[title]} <span>{title}</span>
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

    const ActiveMeal = ({ activeMeal, title }) => {
        if (!activeMeal || !activeMeal) return null; // If no meal is active, don't render anything
    
        const mealData = activeMeal;
        const entries = Object.entries(mealData).filter(([_, value]) => value); // Filter out empty values
    
        return (
            <Card className="grid-item meal active" title={title.toUpperCase()}>
                <Row gutter={[2, 2]}>
                    {entries.map(([key, value], index) => (
                        <Col key={key} span={8}> {/* Two columns layout */}
                            <p>
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                            </p>
                        </Col>
                    ))}
                </Row>
            </Card>
        );
    };


    // Function to determine active meal based on time
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

    // Fetch menu based on today's day
    useEffect(() => {
        updateActiveMeal();
        const fetchMenu = async () => {
            try {
                setLoading(true);

                // Get today's day
                const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

                console.log("Fetching menu for:", today); // Debugging

                // Query Firestore for a document where 'day' matches today's day
                const menuQuery = query(collection(db, "messMenu"), where("day", "==", today));
                const querySnapshot = await getDocs(menuQuery);

                if (!querySnapshot.empty) {
                    const menuData = querySnapshot.docs[0].data(); // Get the first matched document
                    console.log("Menu found:", menuData); // Debugging

                    setBreakfast(menuData.breakfast);
                    setLunch(menuData.lunch);
                    setSnacks(menuData.snacks);
                    setDinner(menuData.dinner);
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
                {/* Column 1 - Student Count */}
                <div className="grid-item student-count">
                    <div className="student-count">
                        <h2>Student&apos;s Count</h2>
                        <p>20</p>
                    </div>
                    {/* <div className="student-count">
                        <h2>Student&apos;s Count</h2>
                        <p>20</p>
                    </div>
                    <div className="student-count">
                        <h2>Student&apos;s Count</h2>
                        <p>20</p>
                    </div> */}
                </div>


                {/* Column 2 - Meal Section */}
                <div className="meal-section">
                    {/* Active Meal */}

                    {activeMeal === 'breakfast' && breakfast.main}
                    {activeMeal === 'lunch' && lunch.main}
                    {activeMeal === 'snacks' && snacks.main}
                    {activeMeal === 'dinner' && <ActiveMeal activeMeal={dinner} title="Dinner" />}

                    {/* Other Meals in One Row */}
                    {/* Other Meals in One Row (Excluding Active Meal) */}
                    <div className="meal-row">
                        {activeMeal !== 'breakfast' && (
                            <MealItem title="Breakfast" meal={breakfast} />
                        )}
                        {activeMeal !== 'lunch' && (
                            // <MealItem mealName="Breakfast" mealData={breakfast} />
                            <MealItem title="Lunch" meal={lunch} />
                        )}
                        {activeMeal !== 'snacks' && (
                            <MealItem title="Snacks" meal={snacks} />
                        )}
                        {activeMeal !== 'dinner' && (
                            <MealItem title="Dinner" meal={dinner} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
