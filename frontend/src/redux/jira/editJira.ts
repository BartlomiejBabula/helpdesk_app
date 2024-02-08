import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { JiraType } from "../types";

type editJiraErrorType = {
  message: string | null;
};

type editJiraType = JiraType;

type PostJiraType = {
  jiraKey: string;
  auto: boolean;
};

export const editJira = createAsyncThunk<
  editJiraType,
  PostJiraType,
  { rejectValue: editJiraErrorType }
>(
  "jira/editJira",

  async (jira, { rejectWithValue }) => {
    const editJira = await api
      .post(`/jira`, jira)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd edycji jira",
        });
      });

    return editJira;
  }
);
