import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Modal,
  Fade,
  Backdrop,
  TextField,
  Select,
} from "@mui/material";
import api from "../../../api/api";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { selectBlockReports } from "../../../selectors/user";
import { getBlockRaport } from "../../../actions/UserActions";
import {
  Dispatcher,
  useAppDispatch,
  useAppSelector,
} from "../../../store/AppStore";
import { useFormik } from "formik";
import * as yup from "yup";

const raportList: { name: string; btt: string }[] = [
  { name: "RAPORT PORANNY", btt: "morning" },
  { name: "RAPORT WOLUMETRYKA", btt: "volumetrics" },
  { name: "RAPORT JIRA SLA", btt: "jiraSLA" },
  { name: "TESTY SELENIUM", btt: "selenium" },
];

interface formikValues {
  type: string;
  issue: string;
  exceptionsDates: string;
}

export const Report = () => {
  const dispatch: Dispatcher = useAppDispatch();
  let blockReports: string[] = useAppSelector(selectBlockReports);
  const [openModal, setModalOpen] = useState(false);

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    formikJira.resetForm();
  };
  const handleRaportGenerate = async (button: string) => {
    switch (button) {
      case "RAPORT PORANNY":
        await api.get(`/reports/morning`);
        dispatch(getBlockRaport());
        setSnackbar({
          children:
            "Zlecono generacje raportu - raport zostanie wysłany na twojego maila",
          severity: "success",
        });
        break;
      case "RAPORT WOLUMETRYKA":
        await api.get(`/reports/volumetrics`);
        dispatch(getBlockRaport());
        setSnackbar({
          children:
            "Zlecono generacje raportu - raport zostanie wysłany na twojego maila",
          severity: "success",
        });
        break;
      case "RAPORT JIRA SLA":
        handleOpenModal();
        break;
      case "TESTY SELENIUM":
        await api.get(`/reports/selenium`); // dla dev /reports/selenium-dev
        dispatch(getBlockRaport());
        setSnackbar({
          children:
            "Uruchomiono selenium - raport zostanie wysłany na twojego maila",
          severity: "success",
        });
        break;
      default:
        break;
    }
  };

  const formikJira = useFormik({
    validationSchema: yup.object().shape({
      issue: yup.string().required("Pole obowiązkowe"),
    }),

    initialValues: {
      type: "esambo",
      issue: "",
      exceptionsDates: "",
    },

    onSubmit: async (values: formikValues, { resetForm }) => {
      let exceptionsDatesArr = values.exceptionsDates
        .replace(/\s+/g, "")
        .split(",");
      exceptionsDatesArr = exceptionsDatesArr.filter((item) => item.length > 0);

      let reqData = {
        type: values.type,
        issue: values.issue.replace(/\s+/g, ""),
        exceptionsDates: exceptionsDatesArr,
      };
      handleCloseModal();
      resetForm();

      await api
        .post(`/reports/sla`, reqData)
        .then(() => {
          setSnackbar({
            children:
              "Zlecono generacje raportu - raport zostanie wysłany na twojego maila",
            severity: "success",
          });
        })
        .catch((error) => {
          setSnackbar({
            children: "Błędne żądanie - raport nie zostanie wygenerowany",
            severity: "error",
          });
        });
      dispatch(getBlockRaport());
    },
  });

  useEffect(() => {
    dispatch(getBlockRaport());
  }, [dispatch]);

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography
        variant='subtitle1'
        sx={{
          marginLeft: 1,
          letterSpacing: 1,
          color: "rgba(0, 0, 0, 0.6)",
          marginBottom: 1,
          fontWeight: "medium",
        }}
      >
        Generowanie ręczne
      </Typography>
      <Stack direction={"row"} spacing={4}>
        {raportList.map((raport, id) => (
          <Button
            key={id}
            variant='contained'
            size='large'
            style={{
              marginBottom: 10,
              width: "16.5vw",
              minWidth: 180,
              backgroundImage:
                "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
            }}
            disabled={blockReports?.includes(raport.btt) ? true : false}
            onClick={() => {
              handleRaportGenerate(raport.name);
            }}
          >
            {raport.name}
          </Button>
        ))}
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
      </Stack>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 425,
              borderRadius: 1,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant='h6' component='h2'>
              Parametry generacji raportu
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                marginBottom: 3,
                marginTop: 3,
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              Uzupełnij numer nadrzędnego zadania oraz daty w formacie
              YYYY-MM-DD dni wykluczeń z SLA, przedzielone przecinkami
            </Typography>
            <form onSubmit={formikJira.handleSubmit}>
              <Select
                id='type'
                name='type'
                sx={{ width: 350, height: 1, marginBottom: 3 }}
                value={formikJira.values.type}
                onChange={formikJira.handleChange}
                error={
                  formikJira.touched.type && Boolean(formikJira.errors.type)
                }
                native
                autoFocus
              >
                <option value='esambo'>eSambo</option>
                <option value='qlik'>QlikView</option>
              </Select>
              <TextField
                autoComplete='off'
                label='Zadanie nadrzędne'
                placeholder={
                  formikJira.values.type === "qlik" ? "QVHD-439" : "ES-37288"
                }
                id='issue'
                name='issue'
                type='text'
                onChange={formikJira.handleChange}
                value={formikJira.values.issue}
                onBlur={formikJira.handleBlur}
                error={
                  formikJira.touched.issue && Boolean(formikJira.errors.issue)
                }
                helperText={formikJira.touched.issue && formikJira.errors.issue}
                sx={{ width: 350 }}
              />
              <TextField
                autoComplete='off'
                label='Dni wyłączone z SLA'
                placeholder='2023-08-06, 2023-08-13, 2023-08-20, 2023-08-27, 2023-09-03'
                id='exceptionsDates'
                name='exceptionsDates'
                type='text'
                multiline
                rows={3}
                onChange={formikJira.handleChange}
                value={formikJira.values.exceptionsDates}
                onBlur={formikJira.handleBlur}
                error={
                  formikJira.touched.exceptionsDates &&
                  Boolean(formikJira.errors.exceptionsDates)
                }
                helperText={
                  formikJira.touched.exceptionsDates &&
                  formikJira.errors.exceptionsDates
                }
                sx={{ width: 350, marginTop: 2 }}
              />
              <Button
                sx={{
                  letterSpacing: 2,
                  height: 42,
                  width: 200,
                  marginTop: 10,
                  backgroundImage:
                    "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
                }}
                type='submit'
                variant='contained'
              >
                Zleć raport
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};
