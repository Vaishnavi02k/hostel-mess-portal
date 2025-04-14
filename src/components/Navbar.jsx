import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
   const [username, setUsername] = useState("");
   const [showMobileMenu, setShowMobileMenu] = useState(false);
   const location = useLocation(); 
   const navigate = useNavigate(); // ✅ For redirect after logout

   useEffect(() => {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername || "guest");
   }, []);

   const isActive = (path) => location.pathname === path ? "bg-green-800 text-green-200" : "";

   const handleLogout = () => {
      localStorage.clear(); // ✅ Clear all stored data
      navigate("/login");   // ✅ Redirect to login
   };

   return (
      <div className="dark:bg-green-900 bg-green-700 z-10 w-full xl:grid xl:place-items-center fixed shadow-lg">
         <nav className="dark:bg-green-900 bg-green-700 text-white xl:flex xl:container">
            <div className="flex pr-48 items-center">
               <img className="mt-4 ml-4 pb-4 h-12" src="/logo.jpg" alt="Logo" />
               <Link className="m-4 text-lg font-bold text-white hover:text-green-200" to={`/${username}/dashboard`}>
                  IIT Goa Mess Portal
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
                  { name: "Dashboard", path: `/${username}/dashboard` },
                  { name: "Inventory", path: `/${username}/inventory` },
                  { name: "Announcements", path: `/${username}/announcements` },
                  { name: "Mess Menu", path: `/${username}/messmenu` },
                  { name: "Reminders", path: `/${username}/reminder` },
                  { name: "All Students", path: `/${username}/allstudents` },
               ].map((item, index) => (
                  <li key={index} className="py-2 grid place-items-center xl:mx-2">
                     <Link
                        to={item.path}
                        className={`p-2 text-white text-center rounded font-bold transition-all duration-300 hover:bg-green-800 hover:text-green-200 ${isActive(item.path)}`}
                     >
                        {item.name}
                     </Link>
                  </li>
               ))}

               {/* ✅ Logout Button */}
               <li className="py-2 grid place-items-center xl:mx-2">
                  <button
                     onClick={handleLogout}
                     className="p-2 bg-red-600 hover:bg-red-700 text-white text-center rounded font-bold transition-all duration-300"
                  >
                     Logout
                  </button>
               </li>
            </ul>
         </nav>
      </div>
   );
}

export default Navbar;
