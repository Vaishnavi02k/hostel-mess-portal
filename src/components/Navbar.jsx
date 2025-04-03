import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
   const [userName, setUserName] = useState("");
   const [showMobileMenu, setShowMobileMenu] = useState(false);

   useEffect(() => {
      const storedUserName = localStorage.getItem("username");
      setUserName(storedUserName || "guest"); // Fallback in case of null
   }, []);

   return (
      <div className="dark:bg-green-900 bg-green-700 z-10 w-full xl:grid xl:place-items-center fixed shadow-lg">
         <nav className="dark:bg-green-900 bg-green-700 text-white xl:flex xl:container">
            <div className="flex w-full items-center">
               <img className="mt-4 pb-4 h-10" src="/logo.png" alt="Logo" />
               <Link className="m-4 text-lg font-bold text-white hover:text-green-200" to="/">
                  IIT MESS
               </Link>
               <button
                  className="px-2 pb-1 ml-auto mr-16 font-bold rounded text-white hover:bg-green-800 xl:hidden"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
               >
                  Menu
               </button>
            </div>

            <ul className={`${showMobileMenu ? "" : "hidden"} xl:flex pb-2 xl:gap-0`}>
               {[
                  { name: "Dashboard", path: `/` },
                  { name: "Inventory", path: `/inventory` },
                  { name: "Notifications", path: `/${userName}/notifications` },
                  { name: "Announcements", path: `/announcements` },
                  { name: "Verification", path: `/${userName}/verification` },
                  { name: "MessMenu", path: `/messmenu` },
                  { name: "Reminder", path: `/reminder` },
                  { name: "QRScanner", path: `/${userName}/scanqr` },
                  { name: "AllStudents", path: `/${userName}/allstudents` },
               ].map((item, index) => (
                  <li key={index} className="py-2 grid place-items-center xl:mx-2">
                     <Link
                        to={item.path}
                        className="p-2 text-white text-center rounded font-bold transition-all duration-300 hover:bg-green-800 hover:text-green-200"
                     >
                        {item.name}
                     </Link>
                  </li>
               ))}
            </ul>
         </nav>
      </div>
   );
}

export default Navbar;
