import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    task: {},
    tasksList: [],
    error: null,
    isLoading: false
  },
  reducers: {
    clearTasks: (state) => {
      state.tasksList = [];
      state.error = null;
      state.isLoading = false;
    },
    setTasks: (state, action) => {
      state.tasksList = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    createTask: (state, action) => {
      state.task = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export default tasksSlice.reducer;
export const { setTasks, clearTasks, setIsLoading, createTask, setError } = tasksSlice.actions;
