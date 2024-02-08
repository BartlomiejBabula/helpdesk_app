import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../AppStore";
import { getJobs } from "./getJobs";
import { JobType } from "../types";

type initialStateType = {
  error: null | string;
  status: "loading" | "succeeded" | "failed" | null;
  jobsList: JobType[];
};

const initialState: initialStateType = {
  error: null,
  status: null,
  jobsList: [],
};

export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    logOut: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getJobs.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getJobs.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.jobsList = payload;
    });
    builder.addCase(getJobs.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });
  },
});

export const jobsSelector = (state: RootState) => state.jobs.jobsList;
export const jobsSelectorStatus = (state: RootState) => state.jobs.status;
export const jobsSelectorError = (state: RootState) => state.jobs.error;

export default jobsSlice.reducer;
