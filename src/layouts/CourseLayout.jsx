import { NavLink, useParams, useNavigate } from "react-router-dom";
import { getRole } from "../utils/auth";

export default function CourseLayout({ children }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = getRole();

  const prefix =
    role === "admin"
      ? "/admin"
      : "/guru";
  // 🔥 STYLE ACTIVE MENU
  const menuClass = ({ isActive }) =>
    `block px-3 py-2 rounded transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-700"
  
      }`;

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">

        {/* HEADER */}
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold">Course Panel</h2>

          <button
            onClick={() => navigate(`${prefix}/courses`)}
            className="mt-2 text-sm text-gray-400 hover:text-white"
          >
            ← Back to Courses
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2">

          <NavLink to={`${prefix}/courses/${id}`} end className={menuClass}>
            Dashboard
          </NavLink>

          <NavLink to={`${prefix}/courses/${id}/students`} className={menuClass}>
            Students
          </NavLink>

          <NavLink to={`${prefix}/courses/${id}/teachers`} className={menuClass}>
            Teachers
          </NavLink>

          <NavLink to={`${prefix}/courses/${id}/questions`} className={menuClass}>
            Question Bank
          </NavLink>

          <NavLink to={`${prefix}/courses/${id}/exams`} className={menuClass}>
            Exams
          </NavLink>

          <NavLink to={`${prefix}/courses/${id}/settings`} className={menuClass}>
            Settings
          </NavLink>

        </nav>

      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="bg-white shadow px-6 py-3 flex justify-between">
          <span className="font-semibold">Course Detail</span>
          <span>📘 Course ID: {id}</span>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-auto">
          {children}
        </div>

      </div>
    </div>
  );
}