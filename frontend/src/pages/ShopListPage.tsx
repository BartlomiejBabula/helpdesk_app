import * as React from "react";
import { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
  useGridApiContext,
  GridRowModel,
} from "@mui/x-data-grid";
import { Box, Stack, Button, TextField, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import { useFormik } from "formik";
import * as yup from "yup";
import { selectStoreList } from "../selectors/user";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addStoreToStoreList, editStore } from "../actions/UserActions";

interface formikValues {
  store: string;
  storeType: string;
  status: string;
  info: string;
}

interface TypeValues {
  addShop: boolean;
}

interface StoreTypes {
  id: number;
  number: string;
  type: string;
  status: string;
  info?: string;
}

const ShopListPage = () => {
  const dispatch = useDispatch<any>();
  const storeList: any = useSelector<any>(selectStoreList);
  const [addShop, setAddShop] = useState<TypeValues["addShop"]>(false);
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const formikAddShop = useFormik({
    validationSchema: yup.object().shape({
      store: yup
        .string()
        .min(3, "Niepoprawna wartość")
        .max(4, "Niepoprawna wartość")
        .required("Pole obowiązkowe"),
      storeType: yup.string().required("Pole obowiązkowe"),
      status: yup.string().required("Pole obowiązkowe"),
    }),

    initialValues: {
      store: "",
      storeType: "",
      status: "",
      info: "",
    },

    onSubmit: async (values: formikValues, { resetForm }) => {
      let newStore = {
        id: storeList.length + 1,
        number: values.store,
        type: values.storeType,
        status: values.status,
        info: values.info && values.info,
      };
      let storeExist: boolean = false;
      storeList.map((store: StoreTypes) => {
        if (store.number === newStore.number) {
          storeExist = true;
        }
      });
      if (storeExist) {
        alert("Sklep o tym numerze istnieje w tabeli");
      } else {
        await dispatch(addStoreToStoreList(newStore));
        resetForm();
      }
    },
  });

  const toggleAddShop = () => {
    setAddShop(!addShop);
  };

  const SelectEditStatusCell = (props: GridRenderCellParams) => {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();

    const handleChange = async (event: SelectChangeEvent) => {
      let newValue = { id, field, value: event.target.value };
      await apiRef.current.setEditCellValue(newValue);
      apiRef.current.stopCellEditMode({ id, field });
    };

    return (
      <Select
        value={value}
        onChange={handleChange}
        size='small'
        sx={{ height: 1 }}
        native
        autoFocus
      >
        <option>Nowy</option>
        <option>Otwarty</option>
        <option>Zamknięty</option>
      </Select>
    );
  };

  const SelectEditStoreTypeCell = (props: GridRenderCellParams) => {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();

    const handleChange = async (event: SelectChangeEvent) => {
      let newValue = { id, field, value: event.target.value };
      await apiRef.current.setEditCellValue(newValue);
      apiRef.current.stopCellEditMode({ id, field });
    };

    return (
      <Select
        value={value}
        onChange={handleChange}
        size='small'
        sx={{ height: 1 }}
        native
        autoFocus
      >
        <option>Franczyza</option>
        <option>Sklep sieciowy</option>
        <option>Multisambo</option>
        <option>Centrala</option>
      </Select>
    );
  };

  const renderSelectEditStoreTypeCell: GridColDef["renderCell"] = (params) => {
    return <SelectEditStoreTypeCell {...params} />;
  };

  const renderSelectEditStatusCell: GridColDef["renderCell"] = (params) => {
    return <SelectEditStatusCell {...params} />;
  };

  const columns: GridColDef[] = [
    { field: "number", headerName: "Sklep", width: 120 },
    {
      field: "type",
      headerName: "Typ sklepu",
      renderEditCell: renderSelectEditStoreTypeCell,
      width: 150,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      renderEditCell: renderSelectEditStatusCell,
      width: 120,
      editable: true,
    },
    {
      field: "info",
      headerName: "Informacje",
      width: 540,
      editable: true,
    },
  ];

  const processRowUpdate = React.useCallback(async (editRow: GridRowModel) => {
    let newStore = {
      id: editRow.id,
      number: editRow.number,
      type: editRow.type,
      status: editRow.status,
      info: editRow.info === undefined ? "" : editRow.info,
    };
    await dispatch(editStore(newStore));
    setSnackbar({
      children: "Store successfully saved",
      severity: "success",
    });
    return editRow;
  }, []);

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        padding: 2,
      }}
    >
      <Typography
        variant='h6'
        sx={{
          letterSpacing: 2,
          color: "primary.main",
          marginLeft: 1,
          marginBottom: 1,
        }}
      >
        Lista Sklepów
      </Typography>
      <Button
        sx={{ position: "absolute", top: 15, right: 15 }}
        onClick={toggleAddShop}
      >
        Dodaj Sklep
      </Button>
      {addShop && (
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
                id='store'
                name='store'
                type='text'
                onChange={formikAddShop.handleChange}
                value={formikAddShop.values.store}
                onBlur={formikAddShop.handleBlur}
                error={
                  formikAddShop.touched.store &&
                  Boolean(formikAddShop.errors.store)
                }
                helperText={
                  formikAddShop.touched.store && formikAddShop.errors.store
                }
                sx={{ width: 175 }}
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
                id='info'
                name='info'
                type='text'
                onChange={formikAddShop.handleChange}
                value={formikAddShop.values.info}
                onBlur={formikAddShop.handleBlur}
                error={
                  formikAddShop.touched.info &&
                  Boolean(formikAddShop.errors.info)
                }
                helperText={
                  formikAddShop.touched.info && formikAddShop.errors.info
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
              }}
              type='submit'
              variant='contained'
            >
              Dodaj sklep
            </Button>
          </form>
        </Box>
      )}
      <DataGrid
        rows={storeList}
        columns={columns}
        density={"compact"}
        components={{ Toolbar: GridToolbar }}
        experimentalFeatures={{ newEditingApi: true }}
        // hideFooter
        disableColumnMenu={true}
        disableDensitySelector={true}
        disableColumnSelector={true}
        initialState={{
          sorting: {
            sortModel: [{ field: "number", sort: "asc" }],
          },
        }}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />
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

export default ShopListPage;
