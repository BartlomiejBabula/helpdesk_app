import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { ApiGicaType } from "../types";

type GetGicaErrorType = {
  message: string | null;
};

type getGicaType = ApiGicaType[];

export const getGica = createAsyncThunk<
  getGicaType,
  void,
  { rejectValue: GetGicaErrorType }
>(
  "gica/getGica",

  async (_, { rejectWithValue }) => {
    const gica = await api
      .get(`/gica`)
      .then((response) => {
        let gicaData = [];
        if (response.data !== undefined) {
          gicaData = response.data.map((data: ApiGicaType) => {
            data.ReceiveTimeInMinutes = parseFloat(
              data.ReceiveTimeInMinutes.toString()
            );
            data.NetworkStoreTimeInMinutes = parseFloat(
              data.NetworkStoreTimeInMinutes.toString()
            );
            data.HypermarketTimeInMinutes = parseFloat(
              data.HypermarketTimeInMinutes.toString()
            );

            return data;
          });
        }
        return gicaData;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd pobierania gica",
        });
      });

    return gica;
  }
);
