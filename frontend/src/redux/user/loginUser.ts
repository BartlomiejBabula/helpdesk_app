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
      .post(`${AppURL}/login`, loginUser)
      .then((response) => {
        setAuthHeader(response.data.accessToken);
        saveToken(response);
        rejectWithValue({ message: null });
        return true;
      })
      .catch((error) => {
        let message = "";
        if (error.response?.status === 401) {
          message = error.response.data;
        } else message = "Problem z Backend - zgłosić do Bartka :)";
        return rejectWithValue({
          message: message,
        });
      });
    return response;
  }
);
