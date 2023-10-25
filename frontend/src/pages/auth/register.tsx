import { useFormik } from "formik";
import * as React from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AppURL } from "../../api/api";
import axios from "axios";
import { AlertProps } from "@mui/material/Alert";
import { Box, Stack, Button, TextField, Typography } from "@mui/material";
import SnackbarAlert from "../../components/SnackbarAlert";

interface RegisterValues {
  email: string;
  password: string;
  rePassword: string;
}

export const RegisterComponent = () => {
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email("Błędny adres email")
        .matches(/@asseco.pl/, "Adres email musi być w domenie asseco.pl")
        .min(6, "Login musi zawierać przynajmniej 6 liter")
        .max(28, "Za długi login - maksymalnie 28 liter")
        .required("Pole obowiązkowe"),
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
      email: "",
      password: "",
      rePassword: "",
    },

    onSubmit: (values: RegisterValues, { resetForm }) => {
      const newUser = {
        email: values.email,
        password: values.password,
      };
      axios
        .post(`${AppURL}/users`, newUser)
        .then((response) => {
          setSnackbar({
            children: "Konto zostało utworzone",
            severity: "success",
          });
          resetForm();
        })
        .catch((error) => {
          setSnackbar({
            children: error.response.data,
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
            mt: 4,
          }}
        >
          <Stack spacing={1} sx={{ width: 300 }}>
            <TextField
              autoComplete='off'
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
              marginTop: 5,
              letterSpacing: 2,
              backgroundImage:
                "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
            }}
            type='submit'
            variant='contained'
          >
            Zarejestruj się
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
              Masz konto?
            </Typography>
            <Button type='button' variant='text' onClick={navigateToLogin}>
              Zaloguj się
            </Button>
          </Box>
        </Box>
      </form>
      <SnackbarAlert alert={snackbar} />
    </>
  );
};
