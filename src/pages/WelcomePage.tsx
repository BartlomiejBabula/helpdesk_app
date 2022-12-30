import { useFormik } from "formik";
import * as yup from "yup";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  login: string;
  password: string;
}

interface RegisterValues {
  login: string;
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
            label='Login'
            variant='standard'
            id='login'
            name='login'
            type='text'
            onChange={formik.handleChange}
            value={formik.values.login}
            onBlur={formik.handleBlur}
            error={formik.touched.login && Boolean(formik.errors.login)}
            helperText={formik.touched.login && formik.errors.login}
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
            label='Login'
            variant='standard'
            id='login'
            name='login'
            type='text'
            onChange={formik.handleChange}
            value={formik.values.login}
            onBlur={formik.handleBlur}
            error={formik.touched.login && Boolean(formik.errors.login)}
            helperText={formik.touched.login && formik.errors.login}
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
  const navigate = useNavigate();
  const formikLogin = useFormik({
    validationSchema: yup.object().shape({
      login: yup
        .string()
        .min(4, "Login musi zawierać przynajmniej 4 liter")
        .max(16, "Za długi login - maksymalnie 16 liter")
        .required("Pole obowiązkowe"),
      password: yup
        .string()
        .min(6, "Hasło musi zawierać przynajmniej 6 liter")
        .required("Pole obowiązkowe"),
    }),

    initialValues: {
      login: "",
      password: "",
    },

    onSubmit: (values: LoginValues) => {
      // alert(JSON.stringify(values, null, 2));
      navigate({ pathname: "/dashboard" });
    },
  });

  const formikRegister = useFormik({
    validationSchema: yup.object().shape({
      login: yup
        .string()
        .min(4, "Login musi zawierać przynajmniej 4 liter")
        .max(16, "Za długi login - maksymalnie 16 liter")
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
      login: "",
      password: "",
      rePassword: "",
    },

    onSubmit: (values: RegisterValues) => {
      alert(JSON.stringify(values, null, 2));
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
    </Container>
  );
};

export default WelcomePage;
