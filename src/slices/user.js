import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    roles: [],
    isLoading: false,
    error: null,
    success: null
  },
  reducers: {
    clearUser: (state) => {
      state.user = {};
      state.roles = [];
      state.isLoading = false;
      state.error = null;
      state.success = null;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
  },
});

export default userSlice.reducer;
export const { clearUser, setUser, setIsLoading, setError, setSuccess } = userSlice.actions;