import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import tt from "../../public/tt.png";

const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleRoleSelect = (role) => {
    setShowDropdown(false);
    navigate("/login", { state: { role } });
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gradient-to-r from-red-500 to-blue-600 text-white p-6 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">ClassroomConnect</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-white text-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
          >
            Login
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg text-black">
              <button
                onClick={() => handleRoleSelect("Principal")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
              >
                Principal
              </button>
              <button
                onClick={() => handleRoleSelect("Teacher")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Teacher
              </button>
              <button
                onClick={() => handleRoleSelect("Student")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
              >
                Student
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center p-2 rounded-lg m-2 lg:max-w-screen-2xl mx-auto">
        <section className="lg:w-1/2 text-center lg:text-left p-6">
          <h2 className="text-4xl font-bold mb-4 text-blue-600">
            Welcome to ClassroomConnect
          </h2>
          <p className="text-xl mb-8 text-gray-800">
            A platform where managing schedules is seamless and efficient. Join
            us to streamline your school's timetable with easy class scheduling,
            real-time updates, and administrative support.
          </p>
          <button
            className="bg-red-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-700 transition duration-300"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Get Started
          </button>
        </section>
        <section className="lg:w-1/2 sm:w-full flex justify-center items-center p-4">
          <div className="relative w-full">
            <img
              src={tt}
              alt="Classroom"
              className="w-full h-auto subtle-move rounded-2xl shadow-lg"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
