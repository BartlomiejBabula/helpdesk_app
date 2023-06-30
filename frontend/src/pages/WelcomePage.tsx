import { useFormik } from "formik";
import * as React from "react";
import * as yup from "yup";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import api, { setAuthHeader } from "../api/api";
import { useDispatch } from "react-redux";
import Alert, { AlertProps } from "@mui/material/Alert";
import { logInAction, getUserProfile } from "../actions/UserActions";
import {
  Card,
  Box,
  Container,
  Stack,
  Button,
  TextField,
  Typography,
} from "@mui/material";

interface LoginValues {
  email: string;
  password: string;
}

interface RegisterValues {
  email: string;
  password: string;
  rePassword: string;
}

const LoginComponent = ({ formik, navigateToRegister }: any) => {
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
            sx={{ color: "primary.main", fontSize: 16, marginRight: 1 }}
          >
            Nie masz konta?
          </Typography>
          <Button type='button' variant='text' onClick={navigateToRegister}>
            Zarejestruj się
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const RegisterComponent = ({ formik, navigateToLogin }: any) => {
  return (
    <Box
      sx={{
        width: "55%",
        paddingX: 8,
        paddingTop: "8%",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={1}>
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
          <TextField
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
            width: "100%",
            marginTop: 5,
            letterSpacing: 2,
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
            sx={{ color: "primary.main", fontSize: 16, marginRight: 1 }}
          >
            Masz konto?
          </Typography>
          <Button type='button' variant='text' onClick={navigateToLogin}>
            Zaloguj się
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const WelcomePage = () => {
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const formikLogin = useFormik({
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
          setSnackbar({
            children: "Błędny login lub hasło",
            severity: "error",
          });
        });
    },
  });

  const handleCloseSnackbar = () => setSnackbar(null);
  const formikRegister = useFormik({
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

    onSubmit: async (values: RegisterValues, { resetForm }) => {
      const newUser = {
        email: values.email,
        password: values.password,
      };
      await api
        .post("/users", newUser)
        .then((res) => {
          console.log(res);
          setSnackbar({
            children: "Konto zostało utworzone",
            severity: "success",
          });
          resetForm();
        })
        .catch((e) => {
          setSnackbar({
            children: e.response.data,
            severity: "error",
          });
        });
    },
  });

  const navigateToRegister = () => {
    navigate({ pathname: "/register" });
  };

  const navigateToLogin = () => {
    navigate({ pathname: "/" });
  };

  return (
    <Container
      fixed
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "10vh",
      }}
    >
      <Card
        sx={{
          width: "75%",
          minWidth: 800,
          height: "50vh",
          minHeight: 450,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "14%",
            // backgroundImage:"linear-gradient(to bottom right, #42a5f5, #1976d2)",
            backgroundColor: "primary.main",
            width: "45%",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant='h6' sx={{ letterSpacing: 4, marginBottom: 2 }}>
            ESAMBO
          </Typography>
          <Typography
            variant='h3'
            sx={{ letterSpacing: 6, fontWeight: "medium" }}
          >
            HELPDESK
          </Typography>
          <Typography
            variant='body1'
            sx={{
              fontWeight: "medium",
              letterSpacing: 3,
              marginTop: 4,
              paddingX: 3,
            }}
          >
            Siemanko, tu znajdziesz wszystko co potrzeba do sprawnej pracy
          </Typography>
        </Box>
        <Routes>
          <Route
            path='/'
            element={
              <LoginComponent
                formik={formikLogin}
                navigateToRegister={navigateToRegister}
              />
            }
          />
          <Route
            path='/register'
            element={
              <RegisterComponent
                formik={formikRegister}
                navigateToLogin={navigateToLogin}
              />
            }
          />
        </Routes>
      </Card>
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
    </Container>
  );
};

export default WelcomePage;
