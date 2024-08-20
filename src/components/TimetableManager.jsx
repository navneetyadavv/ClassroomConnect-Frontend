import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchClassrooms } from "../features/classroom/classroomSlice";
import { PulseLoader } from "react-spinners";

const TimetableManager = ({ classroomId = [], role, onClose }) => {
  const dispatch = useDispatch();
  const { classrooms, loading, error } = useSelector(
    (state) => state.classrooms
  );
  const classroom = classrooms?.find(
    (classroom) => classroom._id === classroomId
  );

  const schedule = classroom?.schedule.map((schedule) => ({
    day: schedule.day.toLowerCase(),
    startTime: schedule.startTime,
    endTime: schedule.endTime,
  }));

  const subjectsList = [
    "Mathematics",
    "Science",
    "History",
    "Geography",
    "English",
    "Physical Education",
    "Art",
    "Music",
    "Computer Science",
    "Biology",
    "Chemistry",
    "Physics",
  ];

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const timeSlots = [
    "9-10",
    "10-11",
    "11-12",
    "12-13",
    "13-14",
    "14-15",
    "15-16",
    "16-17",
  ];

  const [subjects, setSubjects] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (classroom && classroom.timetables) {
      const initialSubjects = {};
      classroom.timetables.forEach((dayTimetable) => {
        const day = dayTimetable.day.toLowerCase();
        initialSubjects[day] = {};
        dayTimetable.periods.forEach((period) => {
          const slot = `${parseInt(period.startTime)}-${parseInt(
            period.endTime
          )}`;
          initialSubjects[day][slot] = period.subject;
        });
      });
      setSubjects(initialSubjects);
    }
  }, [classroom]);

  useEffect(() => {}, [subjects, classrooms]);

  const isScheduled = (day, slot) => {
    const daySchedule = schedule.find(
      (s) => s.day.toLowerCase() === day.toLowerCase()
    );
    if (!daySchedule) return false;

    const [slotStart] = slot.split("-").map((t) => parseInt(t, 10));
    const [startHour] = daySchedule.startTime
      .split(":")
      .map((t) => parseInt(t, 10));
    const [endHour] = daySchedule.endTime
      .split(":")
      .map((t) => parseInt(t, 10));

    return slotStart >= startHour && slotStart < endHour;
  };

  const handleSlotClick = (day, slot) => {
    setSelectedSlot({ day, slot });
  };

  const handleSubjectSelect = (day, slot, subject) => {
    setSubjects((prevSubjects) => ({
      ...prevSubjects,
      [day]: {
        ...prevSubjects[day],
        [slot]: subject,
      },
    }));
    setSelectedSlot({ day, slot });
  };

  const handleSubmit = async (isUpdate = false) => {
    const formattedData = Object.entries(subjects).map(([day, slots]) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1), 
      periods: Object.entries(slots).map(([slot, subject]) => {
        const [startTime, endTime] = slot.split("-");
        return {
          subject,
          startTime: `${startTime}:00`,
          endTime: `${endTime}:00`,
        };
      }),
    }));

    try {
      const url = isUpdate
        ? 'http://localhost:5000/timetable/update-timetable'
        : 'http://localhost:5000/timetable/create-timetable';

      const method = isUpdate ? "patch" : "post";

      const response = await axios({
        method,
        url,
        data: {
          classroomId,
          timetable: formattedData,
        },
      });
      onClose();
      dispatch(fetchClassrooms());
    } catch (error) {}
  };
  if (loading)
    return (
      <div className="flex  w-full justify-center h-64 items-center">
        <PulseLoader color="#1F2937" margin={4} size={14} />
      </div>
    );

  return (
    <div className="sm:p-6 lg:p-8 5 lg:max-w-4xl mx-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 sm:p-3 lg:p-4 text-left">
              Day/Time
            </th>
            {timeSlots.map((slot) => (
              <th
                key={slot}
                className="border border-gray-300 p-2 sm:p-3 lg:p-4 text-left"
              >
                {slot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <tr key={day} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2 sm:p-3 lg:p-4 capitalize font-medium text-gray-700">
                {day}
              </td>
              {timeSlots.map((slot) => (
                <td
                  key={slot}
                  className={`border border-gray-300 p-2 sm:p-3 lg:p-4 ${
                    isScheduled(day, slot) ? "bg-blue-100" : ""
                  } ${slot === "12-13" ? "bg-yellow-100" : ""}`}
                  onClick={() =>
                    role !== "Student" &&
                    isScheduled(day, slot) &&
                    slot !== "12-13" &&
                    handleSlotClick(day, slot)
                  }
                >
                  {slot === "12-13" ? (
                    <span>Break</span>
                  ) : (
                    isScheduled(day, slot) && (
                      <>
                        {subjects[day]?.[slot] || ""}
                        {selectedSlot &&
                          selectedSlot.day === day &&
                          selectedSlot.slot === slot && (
                            <Dropdown
                              options={subjectsList}
                              onSelect={(subject) =>
                                handleSubjectSelect(day, slot, subject)
                              }
                              selectedValue={subjects[day]?.[slot] || ""}
                            />
                          )}
                      </>
                    )
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!classroom.timetables.length && role === "Principal" ? (
        <button
          onClick={() => handleSubmit(false)}
          className="mt-4 px-4 p-2 bg-blue-500 mr-2 text-white rounded"
        >
          Submit
        </button>
      ) : (
        ""
      )}
      {role === "Student" ? (
        ""
      ) : (
        <button
          onClick={() => handleSubmit(true)}
          className="mt-4 px-4 p-2 bg-green-500  text-white rounded"
        >
          Update
        </button>
      )}
    </div>
  );
};

export default TimetableManager;
