import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

type getJiraErrorType = {
  message: string | null;
};

type getBlockedRaportType = string[];

export const getBlockedReports = createAsyncThunk<
  getBlockedRaportType,
  void,
  { rejectValue: getJiraErrorType }
>(
  "reports/getBlockedReports",

  async (_, { rejectWithValue }) => {
    const jira = await api
      .get(`/reports/blocked`)
      .then((response) => {
        let blockedRaports: string[] = [];
        response.data.map(
          (item: any) => (blockedRaports = [...blockedRaports, item.name])
        );
        return blockedRaports;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd pobierania zablokowanych raportów",
        });
      });

    return jira;
  }
);
