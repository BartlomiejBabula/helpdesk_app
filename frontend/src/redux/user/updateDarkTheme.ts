import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

type updateDarkThemeErrorType = {
  message: string | null;
};

type updateDarkThemeType = boolean;

type PostDarkThemeType = {
  id: number;
  darkTheme: boolean;
};

export const updateDarkTheme = createAsyncThunk<
  updateDarkThemeType,
  PostDarkThemeType,
  { rejectValue: updateDarkThemeErrorType }
>(
  "user/darkTheme",

  async (darkTheme, { rejectWithValue }) => {
    const updateDarkTheme = await api
      .post(`/users/theme`, darkTheme)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd edycji motywu",
        });
      });

    return updateDarkTheme;
  }
);
