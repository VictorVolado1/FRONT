import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    roles: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    logOut: (state) => {
      state.user = {};
      state.roles = [];
      state.isLoading = false;
      state.error = null;
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
  },
});

export default userSlice.reducer;
export const { logOut, setUser, setIsLoading, setError } = userSlice.actions;
