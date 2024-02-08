import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../AppStore";
import { StoreType } from "../types";
import { getStoreList } from "./getStoreList";
import { addStore } from "./addStore";
import { editStore } from "./editStore";

type initialStateType = {
  error: null | string;
  status: "loading" | "succeeded" | "failed" | null;
  storeList: StoreType[];
};

const initialState: initialStateType = {
  error: null,
  status: null,
  storeList: [],
};

export const storesSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    logOut: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    //GetStoreList
    builder.addCase(getStoreList.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getStoreList.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.storeList = payload;
    });
    builder.addCase(getStoreList.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //AddStore
    builder.addCase(addStore.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(addStore.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.storeList = [...state.storeList, payload];
    });
    builder.addCase(addStore.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });

    //EditStore
    builder.addCase(editStore.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(editStore.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      state.storeList = state.storeList.map((store: StoreType) =>
        store.id === payload.id ? payload : store
      );
    });
    builder.addCase(editStore.rejected, (state, { payload }) => {
      state.status = "failed";
      if (payload) state.error = payload.message;
    });
  },
});

export const storesSelector = (state: RootState) => state.stores.storeList;
export const storesSelectorStatus = (state: RootState) => state.stores.status;
export const storesSelectorError = (state: RootState) => state.stores.error;

export default storesSlice.reducer;
