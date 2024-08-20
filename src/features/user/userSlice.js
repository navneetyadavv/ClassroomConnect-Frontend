import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserApi,
  deleteUserApi,
  updateUserApi,
  fetchUsersApi,
  fetchAvailableStudentsApi,
  fetchAvailableTeachersApi,
} from "./userAPI";
import { fetchClassrooms } from "../classroom/classroomSlice";


const handleError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const createUser = createAsyncThunk(
  "users/createUser",
  async ({ name, email, password, role }, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const newUser = await createUserApi(
        { name, email, password, role },
        headers
      );
      dispatch(fetchUsers());
      return newUser;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const response = await deleteUserApi({ id }, headers);
      dispatch(fetchUsers());
      dispatch(fetchClassrooms());
      return response.id;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, updatedData }, { dispatch, rejectWithValue }) => {
    try {
      const updatedUser = await updateUserApi(id, updatedData);
      dispatch(fetchUsers());
      dispatch(fetchClassrooms());
      return { id, updatedData: updatedUser };
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const users = await fetchUsersApi();
      return users;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchAvailableStudents = createAsyncThunk(
  "classroom/fetchAvailableStudents",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAvailableStudentsApi();
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchAvailableTeachers = createAsyncThunk(
  "classroom/fetchAvailableTeachers",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAvailableTeachersApi();
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    availableTeachers: [],
    availableStudents: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            ...action.payload.updatedData,
          };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAvailableStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.availableStudents = action.payload;
      })
      .addCase(fetchAvailableStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAvailableTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.availableTeachers = action.payload;
      })
      .addCase(fetchAvailableTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
