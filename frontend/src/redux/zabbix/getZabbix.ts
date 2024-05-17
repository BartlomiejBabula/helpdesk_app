import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { ApiZabbixType } from "../types";

type GetZabbixErrorType = {
  message: string | null;
};

export const getZabbix = createAsyncThunk<
  ApiZabbixType[],
  void,
  { rejectValue: GetZabbixErrorType }
>(
  "zabbix/getZabbix",

  async (_, { rejectWithValue }) => {
    const currentDate = new Date();
    const lastWeekDate = currentDate.getTime() - 1 * 24 * 60 * 60 * 1000;
    const response = await api
      .post(`/zabbix`, { timeStamp: lastWeekDate })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd pobierania zabbix",
        });
      });
    return response;
  }
);
