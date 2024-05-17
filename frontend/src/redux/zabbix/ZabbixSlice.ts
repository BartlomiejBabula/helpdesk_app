import { createAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../AppStore";
import { logOut } from "../user/UserSlice";
import { ApiZabbixType } from "../types";
import { getZabbix } from "./getZabbix";

type initialStateType = {
  shown: boolean;
  error: null | string;
  status: "loading" | "succeeded" | "failed" | null;
  zabbix: ApiZabbixType[];
};

const initialState: initialStateType = {
  error: null,
  status: null,
  shown: true,
  zabbix: [],
};

export const zabbixSlice = createSlice({
  name: "zabbix",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Get
    builder.addCase(getZabbix.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getZabbix.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      const newData = payload.filter(
        (problem) => problem.recoveryEventId === 0
      );
      let isDiffrence = false;
      const objectsEqual: any = (o1: any, o2: any) =>
        typeof o1 === "object" && Object.keys(o1).length > 0
          ? Object.keys(o1).length === Object.keys(o2).length &&
            Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
          : o1 === o2;
      if (newData.length !== state.zabbix.length) {
        state.zabbix = newData;
        if (newData.length > 0) {
          state.shown = false;
        }
      } else {
        newData.forEach((object, key) => {
          let isOK: boolean = false;
          state.zabbix.forEach((zabbix) => {
            const isTheSame = objectsEqual(object, zabbix);
            if (isTheSame === true) {
              isOK = true;
            }
          });
          if (isOK === false && newData.length === key + 1) {
            isDiffrence = true;
          }
        });
        if (isDiffrence) {
          state.zabbix = newData;
          if (newData.length > 0) {
            state.shown = false;
          }
        }
      }
    });
    builder.addCase(getZabbix.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });
    //show
    builder.addCase(shownSnackbarZabbix, (state) => {
      state.shown = true;
    });
    //logout
    builder.addCase(logOut, () => initialState);
  },
});

export const zabbixSelector = (state: RootState) => state.zabbix.zabbix;
export const zabbixSelectorStatus = (state: RootState) => state.zabbix.status;
export const zabbixSelectorError = (state: RootState) => state.zabbix.error;
export const zabbixSelectorShowed = (state: RootState) => state.zabbix.shown;

export const shownSnackbarZabbix = createAction("zabbix/shown");

export default zabbixSlice.reducer;
