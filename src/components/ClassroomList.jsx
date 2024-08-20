import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaUsers, FaClock, FaTrash } from "react-icons/fa";
import ClassroomForm from "./ClassroomForm";
import Select from "react-select";
import {
  deleteClassroom,
  removeTeacherFromClassroom,
  assignTeacherToClassroom,
} from "../features/classroom/classroomSlice";
import { fetchUsers } from "../features/user/userSlice";
import ManageStudentsModal from "./ManageStudentsModal";
import { PulseLoader } from "react-spinners";
import TimetableManager from "./TimetableManager";

const ClassroomList = () => {
  const role = localStorage.getItem("role");

  const dispatch = useDispatch();
  const { classrooms, loading, error } = useSelector(
    (state) => state.classrooms
  );
  const { availableTeachers } = useSelector((state) => state.users);
  const [showForm, setShowForm] = useState(false);
  const [showTimetable, setShowTimetable] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showManageStudentsModal, setShowManageStudentsModal] = useState(false);
  const [currentClassroom, setCurrentClassroom] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateClassroom = () => {
    setShowForm(true);
  };

  const handleDeleteClassroom = (classroomId) => {
    dispatch(deleteClassroom(classroomId));
  };

  const handleAssignTeacher = (classroomId) => {
    setSelectedClassroomId(classroomId);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
  };

  const handleRemoveTeacher = (classroomId) => {
    dispatch(removeTeacherFromClassroom(classroomId));
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleConfirmAssignTeacher = () => {
    if (selectedTeacher && selectedClassroomId) {
      dispatch(
        assignTeacherToClassroom({
          classroomId: selectedClassroomId,
          teacherId: selectedTeacher.value,
        })
      );
      setSelectedClassroomId(null);
      setSelectedTeacher(null);
    }
  };

  const handleCancelAssignTeacher = () => {
    setSelectedClassroomId(null);
    setSelectedTeacher(null);
  };

  const handleManageStudents = (classroom) => {
    setCurrentClassroom(classroom);
    setShowManageStudentsModal(true);
  };

  const handleShowTimetable = (classroom) => {
    setCurrentClassroom(classroom);
    setShowTimetable(true);
  };

  if (loading)
    return (
      <div className="flex w-full justify-center h-64 items-center">
        <PulseLoader color="#1F2937" margin={4} size={14} />
      </div>
    );

  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return showForm ? (
    <ClassroomForm closeForm={() => setShowForm(false)} />
  ) : (
    <div className="container mx-auto p-2">
      {selectedClassroomId && (
        <div className="mb-6">
          <h3 className="text-xl px-2 py-3 font-semibold text-gray-800">
            Assign Teacher
          </h3>
          <Select
            value={availableTeachers.find(
              (option) => option.value === selectedTeacher
            )}
            options={availableTeachers.map((teacher) => ({
              value: teacher._id,
              label: teacher.name,
            }))}
            onChange={handleTeacherSelect}
          />
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleConfirmAssignTeacher}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-2 rounded focus:outline-none focus:shadow-outline"
            >
              Confirm Assignment
            </button>
            <button
              onClick={handleCancelAssignTeacher}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-3 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreateClassroom}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-2 rounded focus:outline-none focus:shadow-outline"
        >
          + Create Classroom
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms && classrooms.length > 0 ? (
          classrooms.map((classroom) => (
            <div
              key={classroom._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                {classroom.name}
              </h2>
              <p className="text-gray-600 mb-4 whitespace-pre-line">
                {classroom.schedule.map(({ day, startTime, endTime }) => (
                  <div key={`${day}-${startTime}-${endTime}`}>
                    {day}: {startTime} - {endTime}
                  </div>
                ))}
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-800 font-medium">Teacher</h3>
                    <p className="text-gray-600">
                      {classroom.teacher
                        ? classroom.teacher.name
                        : "Not Assigned"}
                    </p>
                  </div>
                  <button
                    className="text-blue-500 hover:underline flex items-center"
                    onClick={() =>
                      classroom.teacher
                        ? handleRemoveTeacher(classroom._id)
                        : handleAssignTeacher(classroom._id)
                    }
                  >
                    <FaEdit className="mr-1" />
                    {classroom.teacher ? "Remove Teacher" : "Assign Teacher"}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-800 font-medium">Students</h3>
                    <p className="text-gray-600">{classroom.students.length}</p>
                  </div>
                  <button
                    className="text-blue-500 hover:underline flex items-center"
                    onClick={() => handleManageStudents(classroom)}
                  >
                    <FaUsers className="mr-1" /> Manage
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-800 font-medium">Timetable</h3>
                  </div>
                  <button
                    className="text-blue-500 hover:underline flex items-center"
                    onClick={() => handleShowTimetable(classroom)}
                  >
                    <FaClock className="mr-1" /> View
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleDeleteClassroom(classroom._id)}
                    className="text-red-500 hover:underline flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">
            No classrooms available
          </div>
        )}
      </div>
      {showManageStudentsModal && (
        <ManageStudentsModal
          classroom={currentClassroom}
          onClose={() => setShowManageStudentsModal(false)}
        />
      )}

      {showTimetable && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-auto">
          <div className="rotated-view max-w-screen-lg ">
            <button
              onClick={() => setShowTimetable(false)}
              className="close-button"
            >
              &times;
            </button>
            <h1 className="text-2xl font-bold mb-6">Timetable</h1>
            <TimetableManager
              classroomId={currentClassroom._id}
              role={role}
              onClose={() => setShowTimetable(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomList;
