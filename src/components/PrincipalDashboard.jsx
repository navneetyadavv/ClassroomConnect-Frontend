import React, { useEffect, useState } from "react";
import TeacherList from "./TeacherList";
import StudentList from "./StudentList";
import ClassroomList from "./ClassroomList";
import { useDispatch } from "react-redux";
import { fetchClassrooms } from "../features/classroom/classroomSlice";
import { fetchUsers } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const PrincipalDashboard = ({ setIsAuthenticated, setUserRole }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchClassrooms());
    dispatch(fetchUsers());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState("teachers");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("email");

    setIsAuthenticated(false);
    setUserRole(null);

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-red-500 to-blue-600 p-4 shadow-lg">
        <div className="flex justify-between items-center w-full md:w-auto mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-white">Hello Principal</h1>
          <button
            className="text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={`flex flex-col md:flex-row ${
            menuOpen ? "max-h-48" : "max-h-0"
          } md:max-h-full overflow-hidden md:overflow-visible transition-max-height duration-300 ease-in-out`}
        >
          <button
            onClick={() => setActiveTab("teachers")}
            className={`px-4 py-2 rounded mb-2 md:mb-0 md:mr-2 ${
              activeTab === "teachers"
                ? "bg-red-700 text-white"
                : "bg-white text-red-500"
            }`}
          >
            Teachers
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded mb-2 md:mb-0 md:mr-2 ${
              activeTab === "students"
                ? "bg-blue-700 text-white"
                : "bg-white text-blue-500"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("classrooms")}
            className={`px-4 py-2 rounded mb-2 md:mb-0 md:mr-2 ${
              activeTab === "classrooms"
                ? "bg-green-700 text-white"
                : "bg-white text-green-500"
            }`}
          >
            Classrooms
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded mb-2 md:mb-0 md:mr-2"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="p-2">
        {activeTab === "teachers" && <TeacherList />}
        {activeTab === "students" && <StudentList />}
        {activeTab === "classrooms" && <ClassroomList />}
      </div>
    </div>
  );
};

export default PrincipalDashboard;
