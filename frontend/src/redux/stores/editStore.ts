import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { StoreType } from "../types";

type EditStoreErrorType = {
  message: string | null;
};

type EditStoreType = StoreType;

type PostEditStoreType = StoreType;

export const editStore = createAsyncThunk<
  EditStoreType,
  PostEditStoreType,
  { rejectValue: EditStoreErrorType }
>(
  "stores/editStore",

  async (store, { rejectWithValue }) => {
    const editStore = await api
      .patch(`/stores/${store.id}`, store)
      .then((response) => {
        return store;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd edycji sklepu",
        });
      });

    return editStore;
  }
);
