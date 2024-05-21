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
  email: string;
}

export const ResetPasswordSendEmailComponent = () => {
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
    }),

    initialValues: {
      email: "",
    },

    onSubmit: (values: ResetPasswordValues, { resetForm }) => {
      const reestPassowrd = {
        email: values.email,
      };
      axios
        .post(`${AppURL}/auth/forgot-password`, reestPassowrd)
        .then((response) => {
          setSnackbar({
            children: "Wysłano mail z resetem hasła",
            severity: "success",
          });
          resetForm();
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
            mt: 7,
          }}
        >
          <Stack spacing={3} sx={{ width: 300 }}>
            <Typography sx={{ color: "#457b9d", fontSize: 16 }}>
              Chcesz zresetować hasło ?
            </Typography>
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
            <Typography
              sx={{
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: 13,
              }}
            >
              Na podany adres mailowy wyślemy do Ciebie mail z linkiem
              resetującym hasło
            </Typography>
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
