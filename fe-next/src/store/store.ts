import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./slices/authSlice";
import teacherTestReducer from "./slices/teacherTestSlice";
import studentTestReducer from "./slices/studentTestSlice";
import submissionReducer from "./slices/submissionSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    teacherTests: teacherTestReducer,
    studentTests: studentTestReducer,
    submissions: submissionReducer,
    user: userReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 