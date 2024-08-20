import axios from "axios";

export const createUserApi = async (
  { name, email, password, role },
  headers
) => {
  const response = await axios.post(
    'https://classroom-connect.vercel.app/user/create-user',
    { name, email, password, role },
    headers
  );
  return response.data;
};

export const fetchUsersApi = async () => {
  const response = await axios.get(
   'https://classroom-connect.vercel.app/user/get-users'
  );
  return response.data;
};

export const deleteUserApi = async ({ id }, headers) => {
  const response = await axios.delete(
    `https://classroom-connect.vercel.app/user/delete-user/${id}`,
    headers
  );
  return response.data;
};

export const updateUserApi = async (id, updatedData) => {
  const response = await axios.put(
    `https://classroom-connect.vercel.app/user/update-user/${id}`,
    updatedData
  );
  return response.data;
};

export const fetchAvailableStudentsApi = async () => {
  const response = await axios.get(
    'https://classroom-connect.vercel.app/user/available-students'
  );
  return response.data;
};

export const fetchAvailableTeachersApi = async () => {
  const response = await axios.get(
    'https://classroom-connect.vercel.app/user/available-teachers'
  );
  return response.data;
};
