import { createAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../AppStore";
import { loginAction } from "./loginUser";
import { getUserProfile } from "./getUserProfile";
import { updateDarkTheme } from "./updateDarkTheme";

type initialStateType = {
  error: null | string;
  status: "loading" | "succeeded" | "failed" | null;
  email?: string;
  createdAt?: string;
  isLogged: boolean;
  darkTheme?: boolean;
  role?: "helpdesk" | "carrefour";
};

const initialState: initialStateType = {
  error: null,
  status: null,
  isLogged: false,
  darkTheme: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //login
    builder.addCase(loginAction.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(loginAction.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      if (payload === true) state.isLogged = true;
    });
    builder.addCase(loginAction.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //darkTheme
    builder.addCase(updateDarkTheme.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(updateDarkTheme.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.darkTheme = payload;
    });
    builder.addCase(updateDarkTheme.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //profile
    builder.addCase(getUserProfile.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.createdAt = payload.createdAt;
      state.email = payload.email;
      state.isLogged = true;
      state.darkTheme = payload.darkTheme;
      state.role = payload.role;
    });
    builder.addCase(getUserProfile.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //logout
    builder.addCase(logOut, () => initialState);
  },
});

export const userSelector = (state: RootState) => state.user;
export const userSelectorStatus = (state: RootState) => state.user.status;
export const userSelectorError = (state: RootState) => state.user.error;
export const userSelectorTheme = (state: RootState) => state.user.darkTheme;

export default userSlice.reducer;

export const logOut = createAction("logout");
