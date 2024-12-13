import {
  Box,
  Button,
  Typography,
  Modal,
  Fade,
  Backdrop,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import api from "../../../api/api";
import { useFormik } from "formik";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";

interface formikValues {
  type: string;
  issue: string;
  exceptionsDates: string;
}

export const ModalJiraSLA = ({
  isOpen,
  close,
  setSnackbar,
}: {
  isOpen: boolean;
  setSnackbar: any;
  close: any;
}) => {
  const handleCloseModal = () => {
    formikJira.resetForm();
    close();
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
    },
  });

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
    >
      <Fade in={isOpen}>
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
          <CloseIcon
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              cursor: "pointer",
              fontSize: 20,
            }}
            onClick={handleCloseModal}
          />
          <Typography variant='h6' component='h2'>
            Parametry generacji raportu
          </Typography>
          <Typography
            variant='subtitle2'
            sx={{
              marginBottom: 3,
              marginTop: 3,
              color: "text.secondary",
            }}
          >
            Uzupełnij numer nadrzędnego zadania oraz daty w formacie YYYY-MM-DD
            dni wykluczeń z SLA, przedzielone przecinkami
          </Typography>
          <form onSubmit={formikJira.handleSubmit}>
          <FormControl sx={{ width: 350, height: 1, marginBottom: 3 }}>
          <InputLabel >Projekt</InputLabel>
            <Select
              id='type'
              name='type'
              label="Projekt"
              value={formikJira.values.type}
              onChange={formikJira.handleChange}
              error={formikJira.touched.type && Boolean(formikJira.errors.type)}
            >
              <MenuItem value='esambo'>eSambo</MenuItem>
              <MenuItem value='qlik'>QlikView</MenuItem>
            </Select>
            </FormControl>
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
              }}
               color="secondary"
              type='submit'
              variant='contained'
            >
              Zleć raport
            </Button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};
