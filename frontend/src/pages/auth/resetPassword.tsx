import { useFormik } from "formik";
import * as React from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AppURL } from "../../api/api";
import axios from "axios";
import { AlertProps } from "@mui/material/Alert";
import { Box, Stack, Button, TextField, Typography } from "@mui/material";
import SnackbarAlert from "../../components/SnackbarAlert";

interface ResetPasswordValues {
  password: string;
  rePassword: string;
}

export const ResetPasswordComponent = () => {
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    validationSchema: yup.object().shape({
      password: yup
        .string()
        .min(6, "Hasło musi zawierać przynajmniej 6 liter")
        .required("Pole obowiązkowe"),
      rePassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Niepoprawnie powtórzone hasło")
        .required("Pole obowiązkowe"),
    }),

    initialValues: {
      password: "",
      rePassword: "",
    },

    onSubmit: (values: ResetPasswordValues, { resetForm }) => {
      const reestPassowrd = {
        password: values.password,
        token: window.location.pathname.slice(15),
      };

      axios
        .post(`${AppURL}/auth/reset-password`, reestPassowrd)
        .then((response) => {
          resetForm();
          setSnackbar({
            children: "Zresetowano hasło",
            severity: "success",
          });
          setTimeout(() => {
            navigateToLogin();
          }, 3000);
        })
        .catch((error) => {
          setSnackbar({
            children: error.response.data.message,
            severity: "error",
          });
        });
    },
  });

  const navigateToLogin = () => {
    navigate({ pathname: "/" });
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 6,
          }}
        >
          <Stack spacing={2} sx={{ width: 300 }}>
            <Typography
              sx={{ color: "#457b9d", fontSize: 16, paddingBottom: 1 }}
            >
              Chcesz zresetować hasło ?
            </Typography>
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
            <TextField
              autoComplete='off'
              label='Powtórz hasło'
              variant='standard'
              id='rePassword'
              name='rePassword'
              type='password'
              onChange={formik.handleChange}
              value={formik.values.rePassword}
              onBlur={formik.handleBlur}
              error={
                formik.touched.rePassword && Boolean(formik.errors.rePassword)
              }
              helperText={formik.touched.rePassword && formik.errors.rePassword}
            />
          </Stack>
          <Button
            size='large'
            sx={{
              marginTop: 6,
              letterSpacing: 2,
              backgroundImage:
                "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
            }}
            type='submit'
            variant='contained'
          >
            Resetuj hasło
          </Button>
          <Button
            type='button'
            variant='text'
            sx={{ mt: 1, color: "rgba(0, 0, 0, 0.6)", fontSize: 13 }}
            onClick={navigateToLogin}
          >
            Zaloguj się
          </Button>
        </Box>
      </form>
      <SnackbarAlert alert={snackbar} />
    </>
  );
};
