import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../../firebase-config";
import { collection, getDocs } from "@firebase/firestore";
import "react-toastify/dist/ReactToastify.css";

function LoginForm() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); // ✅ Correctly placed inside component

    useEffect(() => {
        localStorage.setItem("username", "nouser");
        localStorage.setItem("name", "nouser");

        const fetchUsers = async () => {
            try {
                const data = await getDocs(collection(db, "admins"));
                setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const onFinish = (values) => {
        const user = users.find(
            (user) => user.username === values.username && user.password === values.password
        );

        if (user) {
            localStorage.setItem("username", values.username);
            localStorage.setItem("name", values.username);
            toast.success("Logged in Successfully!");
            navigate(`/${values.username}`); // ✅ Works because `useNavigate()` is outside the function
        } else {
            toast.error("Invalid credentials!");
        }
    };

    return (
        <div>
            <Form
                className="m-auto mt-16 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-6 dark:bg-gray-800 dark:border-gray-700"
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
            >
                <h5 className="m-auto mb-4 text-xl font-medium text-gray-900 dark:text-white text-center">
                    Login to HostelMess
                </h5>
                <Form.Item
                    label={<label className="dark:text-white">Username</label>}
                    name="username"
                    rules={[{ required: true, message: "Please input your username!" }]}
                >
                    <Input placeholder="Enter Username" />
                </Form.Item>

                <Form.Item
                    label={<label className="dark:text-white">Password</label>}
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password placeholder="Enter Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" className="w-full" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
            <ToastContainer />
        </div>
    );
}

export default LoginForm;
