import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AppURL, saveToken, setAuthHeader } from "../../api/api";

type UserIsLogged = boolean;

type LoginUserType = {
  email: string;
  password: string;
};

type LoginUserErrorType = {
  message: string | null;
};

export const loginAction = createAsyncThunk<
  UserIsLogged,
  LoginUserType,
  { rejectValue: LoginUserErrorType }
>(
  "user/login",

  async (loginUser: LoginUserType, { rejectWithValue }) => {
    const response = await axios
      .post(`${AppURL}/auth/login`, loginUser)
      .then((response) => {
        setAuthHeader(response.data.accessToken);
        saveToken(response);
        rejectWithValue({ message: null });
        return true;
      })
      .catch((error) => {
        if (
          error.response.data.message === null ||
          error.response.data.message === undefined
        ) {
          return rejectWithValue({
            message: "Błąd z backend - zgłosić do Bartka :)",
          });
        } else {
          return rejectWithValue({
            message: error.response.data.message,
          });
        }
      });
    return response;
  }
);
