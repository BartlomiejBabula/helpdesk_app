import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { JobType } from "../types";

type GetJobErrorType = {
  message: string | null;
};

type endJobType = number;

export const endJob = createAsyncThunk<
  endJobType,
  JobType,
  { rejectValue: GetJobErrorType }
>(
  "jobs/endJob",

  async (row: JobType, { rejectWithValue }) => {
    const jobs = await api
      .post(`/jobs/end`, { id: row.jobId })
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
