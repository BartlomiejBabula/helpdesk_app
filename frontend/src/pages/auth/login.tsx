import { useFormik } from "formik";
import * as React from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import api, { setAuthHeader } from "../../api/api";
import Alert, { AlertProps } from "@mui/material/Alert";
import { logInAction, getUserProfile } from "../../actions/UserActions";
import { Box, Stack, Button, TextField, Typography } from "@mui/material";
import { Dispatcher, useAppDispatch } from "../../store/AppStore";

interface LoginValues {
  email: string;
  password: string;
}

export const LoginComponent = () => {
  const [snackbar, setSnackbar] = React.useState<Pick<
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

    onSubmit: async (values: LoginValues) => {
      const user = { email: values.email, password: values.password };
      api
        .post("/login", user)
        .then((response) => {
          localStorage.setItem("refresh", response.data.refreshToken);
          localStorage.setItem("access", response.data.token);
          setAuthHeader(response.data.token);
          dispatch(logInAction());
          dispatch(getUserProfile());
          navigate({ pathname: "/dashboard" });
        })
        .catch((error) => {
          if (error.response.status === 403) {
            error.message = "Błędny login lub hasło";
          }
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
  const handleCloseSnackbar = () => setSnackbar(null);
  return (
    <Box
      sx={{
        width: "55%",
        paddingX: 8,
        paddingTop: "12%",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
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
            width: "100%",
            marginTop: 5,
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
      </form>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
};
