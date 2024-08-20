import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEllipsisV } from "react-icons/fa";
import { deleteUser } from "../features/user/userSlice";
import UpdateForm from "./UpdateForm";
import UserCreationForm from "./UserCreationForm";
import { PulseLoader } from "react-spinners";

const StudentList = ({ classroomId, role }) => {
  const { users, loading, error } = useSelector((state) => state.users);

  const email = localStorage.getItem("email");

  let students;

  if (role === "Teacher") {
    students = users.filter(
      (user) => user.role === "Student" && user.classroom?._id === classroomId
    );
  } else if (role === "Student") {
    students = users.filter(
      (user) =>
        user.role === "Student" &&
        user.classroom?._id === classroomId &&
        user.email !== email
    );
  } else {
    students = users.filter((user) => user.role === "Student");
  }

  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  const handleUpdateClick = (student) => {
    setSelectedStudent(student);
    setDropdownOpen(null); 
  };

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
    setDropdownOpen(null); 
  };

  const handleCloseUpdateForm = () => {
    setSelectedStudent(null);
  };

  const handleCreateStudent = () => {
    setShowForm(true);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const toggleDropdown = (studentId) => {
    setDropdownOpen(dropdownOpen === studentId ? null : studentId);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading)
    return (
      <div className="flex  w-full justify-center h-64 items-center">
        <PulseLoader color="#1F2937" margin={4} size={14} />
      </div>
    );
  if (error)
    if(error){
      error
    }
    if(error){
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
    }

  return showForm ? (
    <UserCreationForm closeForm={() => setShowForm(false)} role="Student" />
  ) : (
    <div className="w-full ">
      <div className="container mx-auto p-2 w-full 	">
        {role === "Teacher" || role === "Student" ? (
          ""
        ) : (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleCreateStudent}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-2 rounded focus:outline-none focus:shadow-outline"
            >
              + Create Student
            </button>
          </div>
        )}
        <div className=" w-full ">
          <table className="min-w-full bg-white shadow-md rounded-lg ">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 border-b text-center hidden sm:table-cell">
                  Profile
                </th>
                <th className="py-3 px-4 border-b text-center">Name</th>
                <th className="py-3 px-4 border-b text-center hidden sm:table-cell">
                  Email
                </th>
                <th className="py-3 px-4 border-b text-center">Classroom</th>
                {role === "Student" ? (
                  ""
                ) : (
                  <th className="py-3 px-4 border-b text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="hover:bg-gray-100 border-b transition duration-200"
                >
                  <td className="py-3 px-4 text-center hidden sm:table-cell">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold mx-auto">
                      {student.profilePicture ? (
                        <img
                          src={student.profilePicture}
                          alt={student.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(student.name)
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">{student.name}</td>
                  <td className="py-3 px-4 text-center hidden sm:table-cell">
                    {student.email}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {student.classroom ? student.classroom.name : "N/A"}
                  </td>
                  {role === "Student" ? (
                    ""
                  ) : (
                    <td className="py-3 px-4 text-center relative">
                      <button
                        onClick={() => toggleDropdown(student._id)}
                        className="focus:outline-none"
                      >
                        <FaEllipsisV
                          className="cursor-pointer hover:text-gray-700 transition duration-200 text-center align-middle"
                          style={{ fontSize: "1rem" }}
                        />
                      </button>
                      {dropdownOpen === student._id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                        >
                          <button
                            onClick={() => handleUpdateClick(student)}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Update
                          </button>
                          {role === "Teacher" && role === "Student" ? (
                            ""
                          ) : (
                            <div>
                              <button
                                onClick={() => handleDelete(student._id)}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedStudent && (
          <UpdateForm
            userToUpdate={selectedStudent}
            onClose={handleCloseUpdateForm}
          />
        )}
      </div>
    </div>
  );
};

export default StudentList;
