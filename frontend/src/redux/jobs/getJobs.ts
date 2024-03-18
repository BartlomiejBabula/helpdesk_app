import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { JobType } from "../types";

type GetJobErrorType = {
  message: string | null;
};

type getJobType = JobType[];

export const getJobs = createAsyncThunk<
  getJobType,
  void,
  { rejectValue: GetJobErrorType }
>(
  "jobs/getJobs",

  async (_, { rejectWithValue }) => {
    const jobs = await api
      .get(`/jobs`)
      .then((response) => {
        let jobList: JobType[] = response.data.map(
          (job: JobType, i: number) => {
            return (job = {
              ...job,
              id: i + 1,
            });
          }
        );
        return jobList;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd pobierania listy jobów",
        });
      });

    return jobs;
  }
);
