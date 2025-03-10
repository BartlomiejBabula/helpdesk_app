import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../AppStore";
import { ScheduleType } from "../types";
import { getSchedules } from "./getSchedules";
import { logOut } from "../user/UserSlice";
import { editSchedule } from "./editSchedule";

type initialStateType = {
  error: null | string;
  status: "loading" | "succeeded" | "failed" | null;
  schedules: ScheduleType[];
};

const initialState: initialStateType = {
  error: null,
  status: null,
  schedules: [],
};

export const schedulesSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //GetSchedules
    builder.addCase(getSchedules.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getSchedules.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.schedules = payload;
    });
    builder.addCase(getSchedules.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //EditSchedule
    builder.addCase(editSchedule.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(editSchedule.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.schedules = state.schedules.map((schedule: ScheduleType) =>
        schedule._id === payload._id ? payload : schedule
      );
    });
    builder.addCase(editSchedule.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //logout
    builder.addCase(logOut, () => initialState);
  },
});

export const schedulesSelector = (state: RootState) =>
  state.schedules.schedules;
export const schedulesSelectorStatus = (state: RootState) =>
  state.schedules.status;
export const schedulesSelectorError = (state: RootState) =>
  state.schedules.error;

export default schedulesSlice.reducer;
