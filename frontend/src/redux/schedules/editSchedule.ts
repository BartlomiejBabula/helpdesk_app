import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { ScheduleType } from "../types";
import { CronDecode } from "../../function/cron";

type EditScheduleErrorType = {
  message: string | null;
};

type EditScheduleType = ScheduleType;

type PostEditScheduleType = {
  task: string;
  schedule: string;
  isActive: boolean;
  description?: string;
};

export const editSchedule = createAsyncThunk<
  EditScheduleType,
  PostEditScheduleType,
  { rejectValue: EditScheduleErrorType }
>(
  "schedule/editSchedule",

  async (schedule, { rejectWithValue }) => {
    const editStore = await api
      .post(`/schedule/`, schedule)
      .then((response) => {
        let task: ScheduleType = {
          ...response.data,
          cron: CronDecode(schedule.schedule),
        };
        return task;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd edycji harmonogramu",
        });
      });

    return editStore;
  }
);
