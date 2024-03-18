import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../AppStore";
import { getJobs } from "./getJobs";
import { JobType } from "../types";
import { logOut } from "../user/UserSlice";
import { endJob } from "./endJob";
import { restartJob } from "./restartJob";

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
  reducers: {},
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

    //end
    builder.addCase(endJob.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(endJob.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.jobsList = state.jobsList.filter(
        (job: JobType) => job.jobId !== payload
      );
    });
    builder.addCase(endJob.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //restart
    builder.addCase(restartJob.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(restartJob.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.jobsList = state.jobsList.map((job: JobType) => {
        if (job.jobId === payload) {
          job.status = "R";
        }
        return job;
      });
    });
    builder.addCase(restartJob.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //logout
    builder.addCase(logOut, () => initialState);
  },
});

export const jobsSelector = (state: RootState) => state.jobs.jobsList;
export const jobsSelectorStatus = (state: RootState) => state.jobs.status;
export const jobsSelectorError = (state: RootState) => state.jobs.error;

export default jobsSlice.reducer;
