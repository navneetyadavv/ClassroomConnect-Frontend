import React, { useEffect, useState, useRef } from "react";
import StudentList from "./StudentList";
import { useSelector, useDispatch } from "react-redux";
import ClassroomCard from "./ClassroomCard";
import { fetchUsers } from "../features/user/userSlice";
import TimetableManager from "./TimetableManager";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const UserDashboard = ({ setIsAuthenticated, setUserRole }) => {
  const navigate = useNavigate();

  const [view, setView] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const email = localStorage.getItem("email");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const { users, loading, error } = useSelector((state) => state.users);

  const user = users.find((user) => user.email === email);

  let classroomId;

  if (!loading) {
    classroomId = user ? user.classroom?._id : null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("email");

    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/", { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part[0]).join("");
    return initials.toUpperCase();
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (menuOpen) {
      dropdownRef.current.style.height = `${dropdownRef.current.scrollHeight}px`;
    } else {
      dropdownRef.current.style.height = "0px";
    }
  }, [menuOpen]);

  if (loading)
    return (
      <div className="flex w-full justify-center h-64 items-center">
        <PulseLoader color="#1F2937" margin={4} size={14} />
      </div>
    );

  return (
    <div className="p-0">
      <header className="flex justify-between items-center bg-gray-800 p-4 shadow-lg">
        <div className="flex items-center">
          {user && user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-4"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center mr-4">
              {user
                ? getInitials(user.name)
                : user?.role === "Teacher"
                ? "T"
                : "S"}
            </div>
          )}
          <h1 className="text-2xl font-bold text-white">
            Hello {user ? user.name : user?.role}
          </h1>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
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
        <div className="hidden md:flex items-center">
          {classroomId && (
            <div className="flex space-x-4">
              <button
                onClick={() => setView("timetable")}
                className={`px-4 py-2 rounded transition ${
                  view === "timetable"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Timetable
              </button>
              <button
                onClick={() => setView("students")}
                className={`px-4 py-2 rounded transition ${
                  view === "students"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Students
              </button>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4 transition"
          >
            Logout
          </button>
        </div>
      </header>
      <div
        ref={dropdownRef}
        className={`md:hidden bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out`}
        style={{ height: "0px" }}
      >
        {menuOpen && (
          <div className="p-4">
            {classroomId && (
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => {
                    setView("timetable");
                    setMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded transition ${
                    view === "timetable"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                >
                  Timetable
                </button>
                <button
                  onClick={() => {
                    setView("students");
                    setMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded transition ${
                    view === "students"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                >
                  {user.role === "Teacher" ? "Students" : "Classmates"}
                </button>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div className="p-4 w-full h-64 flex justify-center">
        {!loading && classroomId ? (
          <ClassroomCard classroomId={classroomId} />
        ) : (
          <div className="text-red-500 text-lg font-semibold mb-2">
            There is no classroom
          </div>
        )}
      </div>
      <div className="transition-opacity duration-500 p-2">
        {view === "timetable" && (
          <div className=" inset-0 bg-gray-600 bg-opacity-50 overflow-hidden relative pb-10">
            <div className=" fixed rotated-view flex-row justify-center items-center ">
              <button
                onClick={() => setView("")}
                className="close-button"
              >
                &times;
              </button>
              <h1 className="text-2xl font-bold mb-6">Timetable</h1>
              <div className="h-fit overflow-y-auto">
                <TimetableManager classroomId={classroomId} role={user.role} />
              </div>
            </div>
          </div>
        )}
        {view === "students" && (
          <StudentList
            classroomId={classroomId}
            role={user.role}
            email={user.email}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
