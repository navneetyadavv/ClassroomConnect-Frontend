import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../features/user/userSlice";
import UpdateForm from "./UpdateForm";
import UserCreationForm from "./UserCreationForm";
import { PulseLoader } from "react-spinners";

const TeacherList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const teachers = Array.isArray(users) ? users.filter((user) => user.role === "Teacher") : [];

  const [showForm, setShowForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const handleUpdateClick = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleCloseUpdateForm = () => {
    setSelectedTeacher(null);
  };

  const handleCreateTeacher = () => {
    setShowForm(true);
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  if (loading)
    return (
      <div className="flex  w-full justify-center h-64 items-center">
        <PulseLoader color="#1F2937" margin={4} size={14} />
      </div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return showForm ? (
    <UserCreationForm closeForm={() => setShowForm(false)} role="Teacher" />
  ) : (
    <div className="container mx-auto p-2">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreateTeacher}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-3 rounded focus:outline-none focus:shadow-outline"
        >
          + Create Teacher
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher._id}
            className="bg-white p-8  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                {teacher.profilePicture ? (
                  <img
                    src={teacher.profilePicture}
                    alt={teacher.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(teacher.name)
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {teacher.name}
                </h2>
                <p className="text-gray-600">{teacher.email}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Classroom:{" "}
              {teacher.classroom ? teacher.classroom.name : "Not assigned"}
            </p>
            <button
              onClick={() => handleUpdateClick(teacher)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(teacher._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {selectedTeacher && (
        <UpdateForm
          userToUpdate={selectedTeacher}
          onClose={handleCloseUpdateForm}
        />
      )}
    </div>
  );
};

export default TeacherList;
