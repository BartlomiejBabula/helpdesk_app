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
      .then((response) => {
        let jira: JiraType = { auto: false, jiraKey: "" };
        if (response.data !== undefined) {
          jira = response.data;
        }
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
