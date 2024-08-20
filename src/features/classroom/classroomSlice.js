import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchClassroomsApi,
  addClassroomApi,
  deleteClassroomApi,
  removeTeacherFromClassroomApi,
  assignTeacherToClassroomApi,
  updateClassroomStudentsApi,
} from "./classroomAPI";

import {
  fetchAvailableTeachers,
  fetchAvailableStudents,
  fetchUsers,
} from "../user/userSlice.js";





export const fetchClassrooms = createAsyncThunk(
  "classrooms/fetchClassrooms",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchClassroomsApi();
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
export const addClassroom = createAsyncThunk(
  "classrooms/addClassroom",
  async (
    { name, schedule, teacher, students },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const data = await addClassroomApi(
        { name, schedule, teacher, students },
        headers
      );
      dispatch(fetchClassrooms());
      dispatch(fetchUsers());

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const deleteClassroom = createAsyncThunk(
  "classrooms/deleteClassroom",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      await deleteClassroomApi(id, headers);
      dispatch(fetchClassrooms());
      dispatch(fetchUsers());
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);


export const updateClassroomStudents = createAsyncThunk(
  "classroom/updateClassroomStudents",
  async ({ classroomId, newStudents }, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      await updateClassroomStudentsApi({ classroomId, newStudents }, headers);
      dispatch(fetchClassrooms());
      dispatch(fetchUsers());
      dispatch(fetchAvailableStudents());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const removeTeacherFromClassroom = createAsyncThunk(
  "classrooms/removeTeacherFromClassroom",
  async (classroomId, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      await removeTeacherFromClassroomApi(classroomId, headers);
      dispatch(fetchClassrooms());
      dispatch(fetchAvailableTeachers());
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);


export const assignTeacherToClassroom = createAsyncThunk(
  "classrooms/assignTeacherToClassroom",
  async ({ classroomId, teacherId }, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      await assignTeacherToClassroomApi({ classroomId, teacherId }, headers);
      dispatch(fetchClassrooms());
      dispatch(fetchAvailableTeachers());
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const classroomSlice = createSlice({
  name: "classrooms",
  initialState: {
    classrooms: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.classrooms = action.payload;
      })
      .addCase(fetchClassrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addClassroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClassroom.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addClassroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClassroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClassroom.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteClassroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeTeacherFromClassroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTeacherFromClassroom.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeTeacherFromClassroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignTeacherToClassroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTeacherToClassroom.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignTeacherToClassroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default classroomSlice.reducer;
