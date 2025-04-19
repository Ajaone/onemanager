import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaComments,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menus = [
  { path: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
  { path: "/users", icon: <FaUsers />, label: "Users" },
  { path: "/forums", icon: <FaComments />, label: "Forum" },
  { path: "/settings", icon: <FaCog />, label: "Settings" },
];

export default function Sidebar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="w-16 bg-gray-900 text-white h-screen flex flex-col items-center py-6 space-y-6 fixed top-0 left-0">
      {/* Logo or Initials */}
      <div className="text-2xl font-bold">OM</div>

      {/* Menu Icons */}
      <div className="flex flex-col space-y-6 mt-6">
        {menus.map((menu, index) => (
          <Link
            to={menu.path}
            key={index}
            className={`relative group flex justify-center items-center w-10 h-10 rounded hover:bg-gray-700 transition ${
              location.pathname === menu.path ? "bg-gray-700" : ""
            }`}
          >
            {menu.icon}
            <span className="absolute left-12 whitespace-nowrap bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              {menu.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="relative group flex justify-center items-center w-10 h-10 rounded hover:bg-red-700 transition"
        title="Logout"
      >
        <FaSignOutAlt />
        <span className="absolute left-12 whitespace-nowrap bg-red-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
          Logout
        </span>
      </button>
    </div>
  );
}
