import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Switch from "./themeswitch/switch";

function Navbar() {
   const [userName, setUserName] = useState("");
   const [showMobileMenu, setShowMobileMenu] = useState(false);

   useEffect(() => {
      const storedUserName = localStorage.getItem("username");
      setUserName(storedUserName || "guest"); // Fallback in case of null
   }, []);

   return (
      <div className="dark:bg-gray-900 bg-[#64748b] z-10 w-full xl:grid xl:place-items-center fixed">
         <nav className="dark:bg-gray-900 bg- text-slate-200 xl:flex xl:container ">
            <div className="flex w-full items-center">
               <img className="mt-4 pb-4 h-10" src="/logo.png" alt="Logo" />
               <Link className="m-4 text-lg text-black dark:text-white hover:text-white font-bold" to="/">
                  VJTI MESS
               </Link>
               <button 
                  className="px-2 pb-1 ml-auto mr-16 font-bold rounded text-black dark:text-white hover:bg-blue-700 hover:text-white xl:hidden"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
               >
                  Menu
               </button>
            </div>

            <ul className={`${showMobileMenu ? "" : "hidden"} xl:flex pb-2 xl:gap-0`}>
               {[
                  { name: "Dashboard", path: `/${userName}` },
                  { name: "Inventory", path: `/${userName}/inventory` },
                  { name: "Notifications", path: `/${userName}/notifications` },
                  { name: "Announcements", path: `/${userName}/announcements` },
                  { name: "Verification", path: `/${userName}/verification` },
                  { name: "MessMenu", path: `/${userName}/messmenu` },
                  { name: "Reminder", path: `/${userName}/reminder` },
                  { name: "QRScanner", path: `/${userName}/scanqr` },
                  { name: "AllStudents", path: `/${userName}/allstudents` },
               ].map((item, index) => (
                  <li key={index} className="py-2 grid place-items-center xl:mx-2">
                     <Link 
                        to={item.path}
                        className="p-2 text-black dark:text-white text-center rounded font-bold hover:bg-blue-700 hover:text-white"
                     >
                        {item.name}
                     </Link>
                  </li>
               ))}
            </ul>

            {/* <Switch /> */}
         </nav>
      </div>
   );
}

export default Navbar;
