import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../AppStore";
import { logOut } from "../user/UserSlice";
import { ApiGicaType } from "../types";
import { getGica } from "./getGica";

type initialStateType = {
  error: null | string;
  status: "loading" | "succeeded" | "failed" | null;
  gica: ApiGicaType[];
};

const initialState: initialStateType = {
  error: null,
  status: null,
  gica: [],
};

export const gicaSlice = createSlice({
  name: "gica",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Get
    builder.addCase(getGica.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getGica.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.gica = payload;
    });
    builder.addCase(getGica.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });
    //logout
    builder.addCase(logOut, () => initialState);
  },
});

export const gicaSelector = (state: RootState) => state.gica;
export const gicaSelectorStatus = (state: RootState) => state.gica.status;
export const gicaSelectorError = (state: RootState) => state.gica.error;

export default gicaSlice.reducer;
