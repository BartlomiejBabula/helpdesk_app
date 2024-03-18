import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { JobType } from "../types";

type GetJobErrorType = {
  message: string | null;
};

type restartJobType = number;

export const restartJob = createAsyncThunk<
  restartJobType,
  JobType,
  { rejectValue: GetJobErrorType }
>(
  "jobs/restartJob",

  async (row: JobType, { rejectWithValue }) => {
    const jobs = await api
      .post(`/jobs/restart`, { id: row.jobId })
      .then((response) => {
        return row.jobId;
      })
      .catch((error) => {
        return rejectWithValue({
          message: error.response.data.message,
        });
      });

    return jobs;
  }
);
