import axios from "axios";

export const fetchClassroomsApi = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/classroom/get-classrooms`);
  return data;
};

export const addClassroomApi = async (
  { name, schedule, teacher, students },
  headers
) => {
  const response = await axios.post(
    "/classroom/create-classroom",
    { name, schedule, teacher, students },
    headers
  );
  return response.data;
};
export const deleteClassroomApi = async (id, headers) => {
  await axios.delete(`${import.meta.env.VITE_SERVER_DOMAIN}/classroom/delete-classroom/${id}`, headers);
};

export const removeTeacherFromClassroomApi = async (classroomId, headers) => {
  await axios.patch(`${import.meta.env.VITE_SERVER_DOMAIN}/classroom/remove-teacher`, { classroomId, headers });
};

export const assignTeacherToClassroomApi = async (
  { classroomId, teacherId },
  headers
) => {
  await axios.post(
    `${import.meta.env.VITE_SERVER_DOMAIN}/classroom/assign-teacher`,
    { classroomId, teacherId },
    headers
  );
};

export const updateClassroomStudentsApi = async (
  { classroomId, newStudents },
  headers
) => {
  const response = await axios.put(
    `${import.meta.env.VITE_SERVER_DOMAIN}/classroom/update-students-inclassroom`,
    { classroomId, newStudents },
    headers
  );
  return response.data;
};
