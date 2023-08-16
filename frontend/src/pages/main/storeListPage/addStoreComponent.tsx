import * as React from "react";
import { Box, Stack, Button, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import { useFormik } from "formik";
import * as yup from "yup";
import { selectStoreList } from "../../../selectors/user";
import { addStoreToStoreList } from "../../../actions/UserActions";
import {
  Dispatcher,
  useAppDispatch,
  useAppSelector,
} from "../../../store/AppStore";
import { StoreTypes } from "../../../types";

interface formikValues {
  storeNumber: string;
  storeType: string;
  status: string;
  information: string;
}

export const AddShop = () => {
  const dispatch: Dispatcher = useAppDispatch();
  let storeList: StoreTypes[] = useAppSelector(selectStoreList);
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const formikAddShop = useFormik({
    validationSchema: yup.object().shape({
      storeNumber: yup
        .string()
        .min(3, "Niepoprawna wartość")
        .max(3, "Niepoprawna wartość")
        .required("Pole obowiązkowe"),
      storeType: yup.string().required("Pole obowiązkowe"),
      status: yup.string().required("Pole obowiązkowe"),
    }),

    initialValues: {
      storeNumber: "",
      storeType: "",
      status: "",
      information: "",
    },

    onSubmit: async (values: formikValues, { resetForm }) => {
      let newStore = {
        id: storeList.length + 1,
        storeNumber: values.storeNumber,
        storeType: values.storeType,
        status: values.status,
        information: values.information && values.information,
      };
      let storeExist: boolean = false;
      storeList.forEach((store: StoreTypes) => {
        if (store.storeNumber === newStore.storeNumber) {
          storeExist = true;
        }
      });
      if (storeExist) {
        setSnackbar({
          children: "Sklep z tym numerem istnieje",
          severity: "error",
        });
      } else {
        dispatch(addStoreToStoreList(newStore));
        resetForm();
        setSnackbar({
          children: "Utworzono sklep",
          severity: "success",
        });
      }
    },
  });

  return (
    <Box>
      <form onSubmit={formikAddShop.handleSubmit}>
        <Stack
          direction={"row"}
          spacing={1}
          sx={{ marginTop: 3, display: "flex", alignItems: "baseline" }}
        >
          <TextField
            label='Sklep'
            size='small'
            id='storeNumber'
            name='storeNumber'
            type='text'
            onChange={formikAddShop.handleChange}
            value={formikAddShop.values.storeNumber}
            onBlur={formikAddShop.handleBlur}
            error={
              formikAddShop.touched.storeNumber &&
              Boolean(formikAddShop.errors.storeNumber)
            }
            helperText={
              formikAddShop.touched.storeNumber &&
              formikAddShop.errors.storeNumber
            }
            sx={{ width: 205 }}
          />
          <Select
            size='small'
            id='status'
            name='status'
            sx={{ width: 130, height: 1 }}
            value={formikAddShop.values.status}
            onChange={formikAddShop.handleChange}
            error={
              formikAddShop.touched.status &&
              Boolean(formikAddShop.errors.status)
            }
            native
            autoFocus
          >
            <option value=''>Status</option>
            <option value='Nowy'>Nowy</option>
            <option value='Otwarty'>Otwarty</option>
            <option value='Zamknięty'>Zamknięty</option>
          </Select>
          <Select
            size='small'
            id='storeType'
            name='storeType'
            sx={{ width: 200, height: 1 }}
            value={formikAddShop.values.storeType}
            onChange={formikAddShop.handleChange}
            error={
              formikAddShop.touched.storeType &&
              Boolean(formikAddShop.errors.storeType)
            }
            native
            autoFocus
          >
            <option value=''>Typ sklepu</option>
            <option value='Franczyza'>Franczyza</option>
            <option value='Sklep sieciowy'>Sklep sieciowy</option>
            <option value='Multisambo'>Multisambo</option>
            <option value='Centrala'>Centrala</option>
          </Select>
          <TextField
            label='Informacje'
            size='small'
            id='information'
            name='information'
            type='text'
            onChange={formikAddShop.handleChange}
            value={formikAddShop.values.information}
            onBlur={formikAddShop.handleBlur}
            error={
              formikAddShop.touched.information &&
              Boolean(formikAddShop.errors.information)
            }
            helperText={
              formikAddShop.touched.information &&
              formikAddShop.errors.information
            }
            sx={{ width: "70%" }}
          />
        </Stack>
        <Button
          sx={{
            letterSpacing: 2,
            height: 42,
            width: 200,
            marginBottom: 4,
            backgroundImage:
              "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
          }}
          type='submit'
          variant='contained'
        >
          Dodaj sklep
        </Button>
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
