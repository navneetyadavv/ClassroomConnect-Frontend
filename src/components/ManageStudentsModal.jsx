import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAvailableStudents } from "../features/user/userSlice";
import { updateClassroomStudents } from "../features/classroom/classroomSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const ManageStudentsModal = ({ classroom, onClose }) => {
  const dispatch = useDispatch();
  const { availableStudents } = useSelector((state) => state.users);
  const [classroomStudents, setClassroomStudents] = useState(
    classroom.students
  );
  const [updatedAvailableStudents, setUpdatedAvailableStudents] = useState([]);

  useEffect(() => {
    dispatch(fetchAvailableStudents());
  }, [dispatch]);

  useEffect(() => {
    setUpdatedAvailableStudents(availableStudents);
  }, [availableStudents]);

  const handleAddStudent = (student) => {
    setClassroomStudents([...classroomStudents, student]);
    setUpdatedAvailableStudents(
      updatedAvailableStudents.filter((s) => s._id !== student._id)
    );
  };

  const handleRemoveStudent = (student) => {
    setUpdatedAvailableStudents([...updatedAvailableStudents, student]);
    setClassroomStudents(
      classroomStudents.filter((s) => s._id !== student._id)
    );
  };

  const handleUpdateChanges = () => {
    dispatch(
      updateClassroomStudents({
        classroomId: classroom._id,
        currentClassroom: classroom,
        newStudents: classroomStudents,
      })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl m-3">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Manage Students
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {" "}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Classroom Students
            </h3>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {" "}
              {classroomStudents.map((student) => (
                <li
                  key={student._id}
                  className="flex justify-between items-center p-2 border-b border-gray-200"
                >
                  <span className="flex-1">{student.name}</span>
                  <button
                    onClick={() => handleRemoveStudent(student)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Available Students
            </h3>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {" "}
              {/* Added max height and scroll */}
              {updatedAvailableStudents.map((student) => (
                <li
                  key={student._id}
                  className="flex justify-between items-center p-2 border-b border-gray-200"
                >
                  <span className="flex-1">{student.name}</span>
                  <button
                    onClick={() => handleAddStudent(student)}
                    className="text-green-500 hover:text-green-700 ml-2"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleUpdateChanges}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Changes
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentsModal;
