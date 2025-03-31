import React, { useEffect, useState } from 'react'
import MessMenuCard from './MessMenuCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';

function MessMenu() {
  const [menus, setMenus] = useState([]);
  const messMenuRef= collection(db,"messmenu");

  useEffect(()=>{
    const getMenus = async ()=>{
      const data = await getDocs(messMenuRef);
      // console.log(data);
      setMenus(data.docs.map((doc)=>({
        ...doc.data(),id:doc.id}
      )))
    };
    getMenus();
  },[])
  return (
<div className="pt-24 dark:bg-gray-900 ">
      <div className=" font-extrabold  dark:text-blue-600 text-4xl  text-center">Mess Menu</div>
      <div className="lg:ml-20 lg:mr-20 lg:mt-10 md:ml-12 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-4">
        {menus.map((menu) => {
          return (
            <MessMenuCard
              key={menu.id}
              id={menu.id}
              day={menu.day}
              breakfast={menu.breakfast}
              lunch={menu.lunch}
              dinner={menu.dinner}
            />
          );
        })}
      </div>
    </div>
  )
}

export default MessMenu
