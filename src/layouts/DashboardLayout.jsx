import { NavLink } from "react-router-dom";
import { logout } from "../utils/auth";

export default function DashboardLayout({ children }) {

  const menuClass = ({ isActive }) =>
    `block px-3 py-2 rounded transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-gray-700 text-gray-300"
    }`;

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">

        {/* LOGO */}
        <div className="p-5 text-xl font-bold border-b border-gray-700">
          CBT System
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2">

          <NavLink to="/admin" end className={menuClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className={menuClass}>
            Users
          </NavLink>

          <NavLink to="/admin/courses" className={menuClass}>
            Courses
          </NavLink>

          <NavLink to="/admin/running-exams" className={menuClass}>
            Running Exams
          </NavLink>

          <NavLink to="/admin/events" className={menuClass}>
            Events
          </NavLink>

        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition"
          >
            Logout
          </button>
        </div>

      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="bg-white shadow px-6 py-3 flex justify-between">
          <span className="font-semibold">Admin Panel</span>
          <span>👤 Admin</span>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-auto">
          {children}
        </div>

      </div>
    </div>
  );
}