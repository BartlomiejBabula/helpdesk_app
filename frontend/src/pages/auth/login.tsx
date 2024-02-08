import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AlertProps } from "@mui/material/Alert";
import { Box, Stack, Button, TextField, Typography } from "@mui/material";
import SnackbarAlert from "../../components/SnackbarAlert";
import { useAppDispatch, useAppSelector } from "../../redux/AppStore";
import {
  userSelectorError,
  userSelectorStatus,
} from "../../redux/user/UserSlice";
import { loginAction } from "../../redux/user/loginUser";
import { getUserProfile } from "../../redux/user/getUserProfile";
import { getJira } from "../../redux/jira/getJira";
import {
  jiraSelectorError,
  jiraSelectorStatus,
} from "../../redux/jira/JiraSlice";
import { getJobs } from "../../redux/jobs/getJobs";
import {
  jobsSelectorError,
  jobsSelectorStatus,
} from "../../redux/jobs/JobsSlice";
import { getStoreList } from "../../redux/stores/getStoreList";

interface LoginValues {
  email: string;
  password: string;
}

export const LoginComponent = () => {
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectUserError = useAppSelector(userSelectorError);
  const selectUserStatus = useAppSelector(userSelectorStatus);

  const selectJiraError = useAppSelector(jiraSelectorError);
  const selectJiraStatus = useAppSelector(jiraSelectorStatus);

  const selectJobsError = useAppSelector(jobsSelectorError);
  const selectJobsStatus = useAppSelector(jobsSelectorStatus);

  useEffect(() => {
    if (selectUserError !== null && selectUserStatus === "failed") {
      setSnackbar({
        children: selectUserError,
        severity: "error",
      });
    }
    if (selectJiraError !== null && selectJiraStatus === "failed") {
      setSnackbar({
        children: selectJiraError,
        severity: "error",
      });
    }
    if (selectJobsError !== null && selectJobsStatus === "failed") {
      setSnackbar({
        children: selectJobsError,
        severity: "error",
      });
    }
  }, [
    selectUserError,
    selectUserStatus,
    selectJiraError,
    selectJiraStatus,
    selectJobsError,
    selectJobsStatus,
  ]);

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
      await dispatch(loginAction(user));
      await dispatch(getUserProfile());
      await dispatch(getJira());
      await dispatch(getJobs());
      await dispatch(getStoreList());
      navigate({ pathname: "/dashboard/" });
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
