import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../AppStore";
import { getBlockedReports } from "./getBlockedReports";
import { logOut } from "../user/UserSlice";

type initialStateType = {
  error: null | string;
  status: "loading" | "succeeded" | "failed" | null;
  blocked: string[];
};

const initialState: initialStateType = {
  error: null,
  status: null,
  blocked: [],
};

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBlockedReports.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getBlockedReports.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.blocked = payload;
    });
    builder.addCase(getBlockedReports.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //logout
    builder.addCase(logOut, () => initialState);
  },
});

export const reportsSelector = (state: RootState) => state.reports;
export const reportsSelectorStatus = (state: RootState) => state.reports.status;
export const reportsaSelectorError = (state: RootState) => state.reports.error;

export default reportsSlice.reducer;
