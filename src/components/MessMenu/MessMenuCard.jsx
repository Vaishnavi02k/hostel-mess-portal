import React, { useState } from "react";
import { Button, Input, Select, Space } from "antd";
import { db } from "../../firebase-config";
import { updateDoc, doc } from "@firebase/firestore";

const MessMenuCard = (props) => {
    const [isEditingBreakfast, setIsEditingBreakfast] = useState(false);
    const [isEditingLunch, setIsEditingLunch] = useState(false);
    const [isEditingDinner, setIsEditingDinner] = useState(false);
    const [newBreakfast, setNewBreakfast] = useState(props.breakfast);
    const [newLunch, setNewLunch] = useState(props.lunch);
    const [newDinner, setNewDinner] = useState(props.dinner);

    function updateBreakfast() {
        const updateMenu = async (id) => {
            const curMessMenu = doc(db, "messmenu", id);
            const newMessMenu = { breakfast: newBreakfast };
            await updateDoc(curMessMenu, newMessMenu);
        };

        updateMenu(props.id);
        setIsEditingBreakfast(false);
        setTimeout(() => {
            window.location.reload();
        }, 1000)
    }
    function updateLunch() {
        const updateMenu = async (id) => {
            const curMessMenu = doc(db, "messmenu", id);
            const newMessMenu = { lunch: newLunch };
            await updateDoc(curMessMenu, newMessMenu);
        };
        updateMenu(props.id);
        setIsEditingLunch(false);
        setTimeout(() => {
            window.location.reload();
        }, 1000)
    }
    function updateDinner() {
        const updateMenu = async (id) => {
            const curMessMenu = doc(db, "messmenu", id);
            const newMessMenu = { dinner: newDinner };
            await updateDoc(curMessMenu, newMessMenu);
        };
        updateMenu(props.id);
        setIsEditingDinner(false);
        setTimeout(() => {
            window.location.reload();
        }, 1000)
    }

    return (
        <div className="">
            <div class="min-[1401px]:h-80 min-[767px]:h-96 max-[768px]:mx-8  px-6 py-4 my-4 dark:bg-gray-500 bg-gray-100 rounded-lg shadow-lg">
                {/* <h1>{props.Day}</h1> */}
                <div className="font-bold text-xl mb-2 dark:text-black text-[#27272a] text-center pb-2 border-b-4">{props.day}</div>
                <p className="my-2">
                    <div><span className="font-bold text-md mb-2 dark:text-black text-gray-900 font-serif">Breakfast: </span><span className="text-gray-700 dark:text-white">{props.breakfast}</span></div>

                    {isEditingBreakfast ? (
                        <Space direction="vertical" size="middle">
                            <Space.Compact style={{ width: "100%" }}>
                                <Input
                                    defaultValue={props.breakfast}
                                    onChange={(e) => {
                                        setNewBreakfast(e.target.value);
                                    }}
                                />
                                <button class="rounded-lg px-4 py-2 bg-gray-700 text-gray-100 text-xs hover:bg-slate-300 hover:text-black" onClick={updateBreakfast}>Update</button>
                                {/* <Button className="text-[#0c0a09]" onClick={submit1}>
                Update
              </Button> */}
                            </Space.Compact>
                        </Space>
                    ) : (
                        <button class="rounded-lg px-4 py-1 bg-gray-700 text-gray-100 text-xs hover:bg-slate-300 hover:text-black" onClick={() => setIsEditingBreakfast(true)}>Edit</button>

                    )}
                </p>

                <p className="my-2">
                    <div><span className="font-bold text-md mb-2 dark:text-black text-gray-900 font-serif">Lunch: </span><span className="text-gray-700 dark:text-white ">{props.lunch}</span></div>

                    {isEditingLunch ? (
                        <Space direction="vertical" size="middle">
                            <Space.Compact style={{ width: "100%" }}>
                                <Input
                                    defaultValue={props.Lunch}
                                    onChange={(e) => {
                                        setNewLunch(e.target.value);
                                    }}
                                />
                                <button class="rounded-lg px-4 py-2 bg-gray-700 text-gray-100 text-xs hover:bg-slate-300 hover:text-black" onClick={updateLunch}>Update</button>
                            </Space.Compact>
                        </Space>
                    ) : (
                        <button class="rounded-lg px-4 py-1 bg-gray-700 text-gray-100 text-xs hover:bg-slate-300 hover:text-black" onClick={() => setIsEditingLunch(true)}>Edit</button>
                    )}
                </p>
                <p className="my-2">
                    <div><span className="font-bold text-md mb-2 dark:text-black text-gray-900 font-serif">Dinner: </span><span className="text-gray-700 dark:text-white">{props.dinner}</span></div>

                    {isEditingDinner ? (
                        <Space direction="vertical" size="middle">
                            <Space.Compact style={{ width: "100%" }}>
                                <Input
                                    defaultValue={props.Dinner}
                                    onChange={(e) => {
                                        setNewDinner(e.target.value);
                                    }}
                                />
                                <button class="rounded-lg px-4 py-2 bg-gray-700 text-gray-100 text-xs hover:bg-slate-300 hover:text-black" onClick={updateDinner}>Update</button>
                            </Space.Compact>
                        </Space>
                    ) : (
                        <button class="rounded-lg px-4 py-1 bg-gray-700 text-gray-100 text-xs hover:bg-slate-300 hover:text-black" onClick={() => setIsEditingDinner(true)}>Edit</button>
                    )}
                </p>
            </div>
        </div>
    );
};

export default MessMenuCard;
