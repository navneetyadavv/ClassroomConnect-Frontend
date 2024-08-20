import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addClassroom } from "../features/classroom/classroomSlice";
import Select from "react-select";
import {
  fetchAvailableStudents,
  fetchAvailableTeachers,
} from "../features/user/userSlice";

const ClassroomForm = ({ closeForm }) => {
  const dispatch = useDispatch();

  const { availableStudents, availableTeachers } = useSelector(
    (state) => state.users
  );
  const { loading, error } = useSelector((state) => state.classrooms);

  const { register, handleSubmit, control, watch, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      schedule: [{ day: "", startTime: "", endTime: "" }],
      teacher: "",
      students: [],
    },
  });

  const availableDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const { fields, append } = useFieldArray({
    control,
    name: "schedule",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchAvailableStudents());
    dispatch(fetchAvailableTeachers());
  }, [dispatch]);

  const watchSchedule = watch("schedule");
  const watchTeacher = watch("teacher");

  const selectedDays = watchSchedule.map((item) => item.day);

  const filteredTeachers = availableTeachers.filter(
    (teacher) => teacher._id !== watchTeacher
  );

  const isTimeWithinRange = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startRange = 9 * 60; // 9 AM in minutes
    const endRange = 18 * 60; // 6 PM in minutes
    return totalMinutes >= startRange && totalMinutes <= endRange;
  };

  const onSubmit = async (data) => {
    const newErrors = {};
    let hasError = false;

    data.schedule.forEach((schedule, index) => {
      if (!isTimeWithinRange(schedule.startTime)) {
        newErrors[`startTime-${index}`] = "Start time must be within 9 AM to 6 PM.";
        hasError = true;
      }
      if (!isTimeWithinRange(schedule.endTime)) {
        newErrors[`endTime-${index}`] = "End time must be within 9 AM to 6 PM.";
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    data.students = data.students.map((student) => student.value);

    if (data.teacher === "") {
      data.teacher = null;
    }

    dispatch(addClassroom(data));
    closeForm();
  };

  const handleTeacherChange = (selectedTeacher) => {
    setValue("teacher", selectedTeacher ? selectedTeacher.value : "");
  };

  const studentOptions = availableStudents.map((student) => ({
    value: student._id,
    label: student.name,
  }));

  const teacherOptions = filteredTeachers.map((teacher) => ({
    value: teacher._id,
    label: teacher.name,
  }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg"
    >
      <div className="mb-6">
        <label
          className="block text-gray-800 text-lg font-semibold mb-2"
          htmlFor="name"
        >
          Classroom Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: true })}
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {fields.map((item, index) => (
        <div key={item.id} className="mb-6">
          <label
            className="block text-gray-800 text-lg font-semibold mb-2"
            htmlFor={`day-${index}`}
          >
            Day
          </label>
          <select
            id={`day-${index}`}
            {...register(`schedule.${index}.day`, { required: true })}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a day</option>
            {availableDays
              .filter(
                (day) =>
                  !selectedDays.includes(day) ||
                  day === watchSchedule[index].day
              )
              .map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
          </select>

          <label
            className="block text-gray-800 text-lg font-semibold mb-2 mt-4"
            htmlFor={`startTime-${index}`}
          >
            Start Time
          </label>
          <input
            type="time"
            id={`startTime-${index}`}
            {...register(`schedule.${index}.startTime`, { required: true })}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors[`startTime-${index}`] && (
            <p className="text-red-500 text-xs italic">
              {errors[`startTime-${index}`]}
            </p>
          )}

          <label
            className="block text-gray-800 text-lg font-semibold mb-2 mt-4"
            htmlFor={`endTime-${index}`}
          >
            End Time
          </label>
          <input
            type="time"
            id={`endTime-${index}`}
            {...register(`schedule.${index}.endTime`, { required: true })}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors[`endTime-${index}`] && (
            <p className="text-red-500 text-xs italic">
              {errors[`endTime-${index}`]}
            </p>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ day: "", startTime: "", endTime: "" })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-6"
      >
        Add Schedule
      </button>

      <div className="mb-6">
        <label
          className="block text-gray-800 text-lg font-semibold mb-2"
          htmlFor="teacher"
        >
          Teacher
        </label>
        <Select
          id="teacher"
          value={teacherOptions.find((option) => option.value === watchTeacher)}
          options={teacherOptions}
          onChange={handleTeacherChange}
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-800 text-lg font-semibold mb-2"
          htmlFor="students"
        >
          Students
        </label>
        <Select
          id="students"
          isMulti
          options={studentOptions}
          onChange={(selectedOptions) => setValue("students", selectedOptions)}
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? "Creating..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={closeForm}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
            </button>
      </div>
    </form>
  );
};

export default ClassroomForm;
