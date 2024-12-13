import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

type GetProfileErrorType = {
  message: string | null;
};

type getUserProfileType = {
  id: number;
  email: string;
  createdAt: string;
  darkTheme?: boolean;
  role?: "helpdesk" | "carrefour";
};

export const getUserProfile = createAsyncThunk<
  getUserProfileType,
  void,
  { rejectValue: GetProfileErrorType }
>(
  "user/getUserProfile",

  async (_, { rejectWithValue }) => {
    const user = await api
      .get(`/users/profile`)
      .then((response) => {
        let user: getUserProfileType = response.data;
        rejectWithValue({ message: null });
        return user;
      })
      .catch((error) => {
        return rejectWithValue({
          message: "Błąd pobierania profilu",
        });
      });

    return user;
  }
);
