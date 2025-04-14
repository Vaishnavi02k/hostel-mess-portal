import React, { useEffect, useState } from "react";
import { Table, Input, Select, Tag } from "antd";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications

const { Option } = Select;

function AllStudents() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("pending");
    const [messPrices, setMessPrices] = useState({}); // State to store mess prices

    // Function to fetch mess prices
    const fetchMessPrices = async () => {
        const priceCollection = collection(db, "messPrices");
        const priceSnapshot = await getDocs(priceCollection);

        const prices = {};
        priceSnapshot.forEach((doc) => {
            prices[doc.id] = doc.data().price; // Assuming the price field is named 'price'
        });
        setMessPrices(prices); // Set the fetched prices into the state
    };

    // Function to fetch student and payment data
    const fetchStudentData = async () => {
        const studentSnapshot = await getDocs(collection(db, "studentdata"));
        const paymentSnapshot = await getDocs(collection(db, "messPayment"));

        const studentList = studentSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));

        const paymentMap = {};
        paymentSnapshot.docs.forEach((doc) => {
            const data = doc.data();

            if (data.regNo) {
                paymentMap[data.regNo] = { ...data, docId: doc.id };
            }
        });
        return { studentList, paymentMap };
    };

    // Function to merge student and payment data
    const mergeStudentData = (studentList, paymentMap) => {
        const mergedData = studentList.map((student) => {
            const payment = paymentMap[student.regno] || {};

            const { breakfast = 0, lunch = 0, snacks = 0, dinner = 0 } = payment; // Log destructured values
            
            // Calculate the total based on messPrices from Firebas
            const total =
                breakfast * (messPrices.breakfast || 15) +
                lunch * (messPrices.lunch || 15) +
                snacks * (messPrices.snacks || 0) +
                dinner * (messPrices.dinner || 0);

            return {
                ...student,
                meals: { breakfast, lunch, snacks, dinner },
                pendingAmount: total,
                paymentDocId: payment.docId,
            };

        });
        setStudents(mergedData);
    };

  // First effect: Fetch mess prices on mount
useEffect(() => {
    const fetchPrices = async () => {
        await fetchMessPrices(); // sets messPrices
    };
    fetchPrices();
}, []); // runs only once

// Second effect: runs only after messPrices is fetched
useEffect(() => {
    if (Object.keys(messPrices).length === 0) return; // Skip if not yet loaded

    const fetchAndMerge = async () => {
        const { studentList, paymentMap } = await fetchStudentData();
        mergeStudentData(studentList, paymentMap);
    };

    fetchAndMerge();
}, [messPrices]); // run only when messPrices has actual data
    
    // Empty dependency array to ensure it runs only once after the first render

    const markAsPaid = async (regNo, paymentDocId) => {
        try {
            const paymentRef = doc(db, "messPayment", paymentDocId);

            // Set the meal counts to 0 to mark as paid
            await updateDoc(paymentRef, {
                breakfast: 0,
                lunch: 0,
                snacks: 0,
                dinner: 0,
            });

            // Update the student data with 0 amounts
            const updatedStudents = students.map((student) => {
                if (student.regNo === regNo) {
                    return {
                        ...student,
                        meals: { breakfast: 0, lunch: 0, snacks: 0, dinner: 0 },
                        pendingAmount: 0, // Mark the pending amount as 0
                    };
                }
                return student;
            });
            // Show a success toast message
            toast.success(`Student is marked as Paid!`);
            setStudents(updatedStudents);

            // Optional: Reload the page after a short delay to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error("Error marking as paid:", error);
            toast.error("Failed to update payment status.");
        }
    };

    const filteredData = students.filter((student) => {
        const matchSearch =
            `${student.firstname} ${student.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.regNo?.toString().includes(searchTerm);

        const matchStatus =
            filterStatus === "all"
                ? true
                : filterStatus === "pending"
                    ? student.pendingAmount > 0
                    : student.pendingAmount === 0;

        return matchSearch && matchStatus;
    });

    const columns = [
        {
            title: "Name",
            key: "name",
            render: (_, record) => (
                <span className="font-semibold">
                    {record.firstname} {record.lastname}
                </span>
            ),
            sorter: (a, b) =>
                `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`),
        },
        {
            title: "Reg No",
            dataIndex: "regno",
            key: "regNo",
            sorter: (a, b) => a.regNo - b.regNo,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Contact",
            dataIndex: "contact_no",
            key: "contact_no",
        },
        {
            title: "Status",
            key: "status",
            render: (_, student) =>
                student.pendingAmount > 0 ? (
                    <Tag color="red" className="font-semibold">Pending</Tag>
                ) : (
                    <Tag color="green">Paid</Tag>
                ),
            filters: [
                { text: "Pending", value: "pending" },
                { text: "Paid", value: "paid" },
            ],
            onFilter: (value, record) => {
                const isPending = record.pendingAmount > 0;
                return value === "pending" ? isPending : !isPending;
            },
        },
        {
            title: "Amount to Pay",
            key: "pendingAmount",
            render: (_, student) =>
                student.pendingAmount > 0 ? (
                    <span className="text-red-600 font-semibold">₹{student.pendingAmount}</span>
                ) : (
                    <span>₹0</span>
                ),
            sorter: (a, b) => a.pendingAmount - b.pendingAmount,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, student) =>
                student.pendingAmount > 0 ? (
                    <button
                        onClick={() => markAsPaid(student.regNo, student.paymentDocId)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                        Mark as Paid
                    </button>
                ) : (
                    <span className="text-gray-400 italic">Paid</span>
                ),
        },
    ];

    return (
        <div className="pt-24 px-4 pb-10 bg-[#f4fff4] min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6">All Students</h2>

            <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
                <Input
                    placeholder="Search by name..."
                    className="md:w-2/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                />
                <Select
                    className="md:w-1/3"
                    value={filterStatus}
                    onChange={(value) => setFilterStatus(value)}
                >
                    <Option value="all">All</Option>
                    <Option value="pending">Pending Only</Option>
                    <Option value="paid">Paid Only</Option>
                </Select>
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{ pageSize: 6 }}
                className="bg-white shadow-lg rounded-lg"
            />

            {/* Add ToastContainer for displaying toast notifications */}
            <ToastContainer />
        </div>
    );
}

export default AllStudents;
