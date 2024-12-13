import * as React from "react";
import { Paper, Stack, Button, TextField, MenuItem, InputLabel, FormControl } from "@mui/material";
import Select from "@mui/material/Select";
import { AlertProps } from "@mui/material/Alert";
import { useFormik } from "formik";
import * as yup from "yup";
import SnackbarAlert from "../../../components/SnackbarAlert";
import { useAppDispatch, useAppSelector } from "../../../redux/AppStore";
import { StoreType } from "../../../redux/types";
import { storesSelector } from "../../../redux/stores/StoresSlice";
import { addStore } from "../../../redux/stores/addStore";

interface formikValues {
  storeNumber: string;
  storeType: string;
  status: string;
  information: string;
}

export const AddShop = () => {
  const dispatch = useAppDispatch();
  const storeList = useAppSelector(storesSelector);
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

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
      storeList.forEach((store: StoreType) => {
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
        dispatch(addStore(newStore));
        resetForm();
        setSnackbar({
          children: "Utworzono sklep",
          severity: "success",
        });
      }
    },
  });

  return (
    <Paper variant='outlined' sx={{ padding: 2, marginBottom: 4 }}>
      <form onSubmit={formikAddShop.handleSubmit}>
        <Stack
          direction={"row"}
          spacing={1}
          sx={{ display: "flex", alignItems: "baseline" }}
        >
          <TextField
            autoComplete='off'
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
          <FormControl sx={{ width: 130, height: 1 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            size='small'
            id='status'
            name='status'
            label="Status"
            value={formikAddShop.values.status}
            onChange={formikAddShop.handleChange}
            error={
              formikAddShop.touched.status &&
              Boolean(formikAddShop.errors.status)
            }
          >
            <MenuItem value='Nowy'>Nowy</MenuItem>
            <MenuItem value='Otwarty'>Otwarty</MenuItem>
            <MenuItem value='Zamknięty'>Zamknięty</MenuItem>
          </Select>
          </FormControl>
          <FormControl sx={{ width: 200, height: 1 }} size="small">
          <InputLabel>Typ sklepu</InputLabel>
          <Select
            size='small'
            id='storeType'
            name='storeType'
            label="Typ sklepu"
            value={formikAddShop.values.storeType}
            onChange={formikAddShop.handleChange}
            error={
              formikAddShop.touched.storeType &&
              Boolean(formikAddShop.errors.storeType)
            }
          >
            <MenuItem value='Franczyza'>Franczyza</MenuItem>
            <MenuItem value='Sklep sieciowy'>Sklep sieciowy</MenuItem>
            <MenuItem value='Multisambo'>Multisambo</MenuItem>
            <MenuItem value='Centrala'>Centrala</MenuItem>
          </Select>
          </FormControl>
          <TextField
            autoComplete='off'
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
          }}
          color="secondary"
          type='submit'
          variant='contained'
        >
          Dodaj sklep
        </Button>
      </form>
      <SnackbarAlert alert={snackbar} />
    </Paper>
  );
};
