import { configureStore } from "@reduxjs/toolkit";
import classroomReducer from "./features/classroom/classroomSlice";
import userReducer from "./features/user/userSlice";


export const store = configureStore({
  reducer: {
    users: userReducer,
    classrooms: classroomReducer,
  },
});
export default store;
