import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { StoreType } from "../types";

type getStoresErrorType = {
  message: string | null;
};

type getStoreListType = StoreType[];

export const getStoreList = createAsyncThunk<
  getStoreListType,
  void,
  { rejectValue: getStoresErrorType }
>(
  "stores/getStoreList",

  async (_, { rejectWithValue }) => {
    const storeList = await api
      .get(`/stores`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd pobierania sklepów",
        });
      });

    return storeList;
  }
);
