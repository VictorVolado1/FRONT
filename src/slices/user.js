import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    isLoading: false,
    loginInfo: {},
  },
  reducers: {
    clearUser: (state) => {
      state.user = {};
      state.isLoading = false;
      state.loginInfo = {};
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLoginInfo: (state, action) => {
      state.loginInfo = action.payload;
    },
    clearLoginInfo: (state) => {
      state.loginInfo = {};
    },
  },
});

export default userSlice.reducer;
export const { clearUser, setUser, setIsLoading, setLoginInfo, clearLoginInfo } = userSlice.actions;