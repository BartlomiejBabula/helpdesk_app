import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { setAuthHeader, AppURL } from "../../api/api";
import axios from "axios";
import { AlertProps } from "@mui/material/Alert";
import {
  logInAction,
  getUserProfile,
  getJobs,
  getReplication,
} from "../../actions/UserActions";
import { Box, Stack, Button, TextField, Typography } from "@mui/material";
import { Dispatcher, useAppDispatch } from "../../store/AppStore";
import SnackbarAlert from "../../components/SnackbarAlert";

interface LoginValues {
  email: string;
  password: string;
}

export const LoginComponent = () => {
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const dispatch: Dispatcher = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email("Błędny adress email")
        .min(6, "Login musi zawierać przynajmniej 6 liter")
        .max(28, "Za długi login - maksymalnie 28 liter")
        .required("Pole obowiązkowe"),
      password: yup
        .string()
        .min(6, "Hasło musi zawierać przynajmniej 6 liter")
        .required("Pole obowiązkowe"),
    }),

    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: (values: LoginValues) => {
      const user = { email: values.email, password: values.password };
      axios
        .post(`${AppURL}/login`, user)
        .then((response) => {
          localStorage.setItem("refresh", response.data.refreshToken);
          localStorage.setItem("access", response.data.accessToken);
          setAuthHeader(response.data.accessToken);
          dispatch(logInAction());
          dispatch(getUserProfile());
          dispatch(getJobs());
          dispatch(getReplication());
          navigate({ pathname: "/dashboard/" });
        })
        .catch((error) => {
          if (error.response.status === 401) {
            error.message = error.response.data;
          } else error.message = "Problem z Backend - zgłosić do Bartka :)";
          setSnackbar({
            children: error.message,
            severity: "error",
          });
        });
    },
  });

  const navigateToRegister = () => {
    navigate({ pathname: "/register" });
  };

  useEffect(() => {
    if (localStorage.getItem("refresh") !== null)
      navigate({ pathname: "/dashboard/" });
  }, [navigate]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 7,
          }}
        >
          <Stack spacing={2} sx={{ width: 300 }}>
            <TextField
              label='Email'
              variant='standard'
              id='email'
              name='email'
              type='text'
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              autoComplete='off'
              label='Hasło'
              variant='standard'
              id='password'
              name='password'
              type='password'
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Stack>
          <Button
            size='large'
            sx={{
              width: 200,
              marginTop: 8,
              letterSpacing: 2,
              backgroundImage:
                "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
            }}
            type='submit'
            variant='contained'
          >
            Zaloguj się
          </Button>
          <Box
            sx={{
              marginTop: 3,
              display: "flex",
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 16, marginRight: 1 }}
            >
              Nie masz konta?
            </Typography>
            <Button type='button' variant='text' onClick={navigateToRegister}>
              Zarejestruj się
            </Button>
          </Box>
        </Box>
      </form>
      <SnackbarAlert alert={snackbar} />
    </>
  );
};
