import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassrooms } from "../features/classroom/classroomSlice";
import { PulseLoader } from "react-spinners";

const ClassroomCard = ({ classroomId, role }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClassrooms());
  }, [dispatch]);

  const { classrooms, loading, error } = useSelector(
    (state) => state.classrooms
  );

  const classroom = classrooms?.find(
    (classroom) => classroom._id === classroomId
  );

  const days = classroom?.schedule.map((schedule) => schedule.day) || [];

  if (loading)
    return (
      <div className="flex  w-full justify-center h-64 items-center">
        <PulseLoader color="#1F2937" margin={4} size={14} />
      </div>
    );

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (!classroom) {
    return (
      <div className="text-center py-4 text-gray-500">Classroom not found</div>
    );
  }

  return (
    <div className="w-full max-w-md rounded overflow-hidden shadow-lg bg-gray-100 p-6">
      <div className="font-bold text-2xl mb-4 text-center text-blue-600">
        {classroom.name}
      </div>
      <div className="text-gray-700 text-base mb-4">
        <strong className="block mb-2">Schedule on:</strong>
        <div className="flex flex-wrap justify-center">
          {days.map((day) => (
            <span
              key={day}
              className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              {day}
            </span>
          ))}
        </div>
      </div>
      <div className="text-gray-700 text-base">
        <strong>Total Students:</strong> {classroom.students.length}
      </div>
    </div>
  );
};

export default ClassroomCard;
