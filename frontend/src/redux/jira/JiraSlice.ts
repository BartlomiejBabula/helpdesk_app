import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../AppStore";
import { getJira } from "./getJira";
import { editJira } from "./editJira";

type initialStateType = {
  error: null | string;
  status: "loading" | "succeeded" | "failed" | null;
  jiraKey?: string;
  auto?: boolean;
};

const initialState: initialStateType = {
  error: null,
  status: null,
};

export const jiraSlice = createSlice({
  name: "jira",
  initialState,
  reducers: {
    logOut: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    //Get
    builder.addCase(getJira.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getJira.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.auto = payload.auto;
      state.jiraKey = payload.jiraKey;
    });
    builder.addCase(getJira.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //Edit
    builder.addCase(editJira.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(editJira.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.auto = payload.auto;
      state.jiraKey = payload.jiraKey;
    });
    builder.addCase(editJira.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });
  },
});

export const jiraSelector = (state: RootState) => state.jira;
export const jiraSelectorStatus = (state: RootState) => state.jira.status;
export const jiraSelectorError = (state: RootState) => state.jira.error;

export default jiraSlice.reducer;
