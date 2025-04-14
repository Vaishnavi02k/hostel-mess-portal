import React, { useEffect, useState } from "react";
import MessMenuCard from "./MessMenuCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import UpdatePrices from "./UpdatePrices";

function MessMenu() {
  const [menus, setMenus] = useState([]);
  const messMenuRef = collection(db, "messMenu");

  useEffect(() => {
    const getMenus = async () => {
      const data = await getDocs(messMenuRef);
      const menuList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Firestore ID
      }));

      // Sort menus by numeric ID (converting ID to a number if it's stored as a string)
      menuList.sort((a, b) => Number(a.id) - Number(b.id));

      setMenus(menuList);
    };
    getMenus();
  }, []);

  return (
    <div className="dark:bg-gray-900">
      {/* <div className="font-extrabold dark:text-blue-600 text-xl text-center">
        Detailed Mess Menu
      </div> */}
      <UpdatePrices />
      <div className="lg:ml-20 lg:mr-20 lg:mt-10 md:ml-12 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-4">
        {menus.map((menu) => (
          <MessMenuCard
            key={menu.id}
            id={menu.id}
            day={menu.day}
            breakfast={menu.breakfast}
            lunch={menu.lunch}
            snacks={menu.snacks}
            dinner={menu.dinner}
          />
        ))}
      </div>
    </div>
  );
}

export default MessMenu;
