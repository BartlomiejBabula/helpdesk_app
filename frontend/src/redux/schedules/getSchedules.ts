import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { ScheduleType } from "../types";
import { CronDecode } from "../../function/cron";

type GetSchedulesErrorType = {
  message: string | null;
};

type getSchedulesType = ScheduleType[];

export const getSchedules = createAsyncThunk<
  getSchedulesType,
  void,
  { rejectValue: GetSchedulesErrorType }
>(
  "schedules/getSchedules",

  async (_, { rejectWithValue }) => {
    const schedules = await api
      .get(`/schedule`)
      .then((response) => {
        let schedules: ScheduleType[] = response.data.map(
          (schedule: ScheduleType) => {
            return (schedule = {
              ...schedule,
              cron: CronDecode(schedule.schedule),
            });
          }
        );
        return schedules;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd pobierania harmonogramów",
        });
      });

    return schedules;
  }
);
