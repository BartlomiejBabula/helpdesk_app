import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { StoreType } from "../types";

type addStoreErrorType = {
  message: string | null;
};

type AddStoreType = StoreType;

type PostStoreType = StoreType;

export const addStore = createAsyncThunk<
  AddStoreType,
  PostStoreType,
  { rejectValue: addStoreErrorType }
>(
  "stores/addStore",

  async (store, { rejectWithValue }) => {
    const addStore = await api
      .post(`/stores`, store)
      .then((response) => {
        return store;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd dodawania sklepu",
        });
      });

    return addStore;
  }
);
