import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { JiraType } from "../types";

type GetJiraErrorType = {
  message: string | null;
};

type getJiraType = JiraType;

export const getJira = createAsyncThunk<
  getJiraType,
  void,
  { rejectValue: GetJiraErrorType }
>(
  "jira/getJira",

  async (_, { rejectWithValue }) => {
    const jira = await api
      .get(`/jira`)
      .then((response3) => {
        let jira: JiraType = response3.data[0];
        return jira;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd pobierania jira",
        });
      });

    return jira;
  }
);
