import { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
  useGridApiContext,
} from "@mui/x-data-grid";
import { Box, Stack, Button, TextField, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useFormik } from "formik";
import * as yup from "yup";

interface formikValues {
  store: string;
  storeType: string;
  status: string;
  info: string;
}

interface TypeValues {
  addShop: boolean;
}

interface ArrayTypes {
  id: number;
  col1: string;
  col2: string;
  col3: string;
  col4?: string;
}

const ShopListPage = () => {
  const [addShop, setAddShop] = useState<TypeValues["addShop"]>(false);
  const [rowsArr, setRowsArr] = useState<ArrayTypes[]>([
    {
      id: 1,
      col1: "A88",
      col2: "Franczyza",
      col3: "Nowy",
      col4: "Wykaz placówek handowych_20150101",
    },
    {
      id: 2,
      col1: "A88",
      col2: "Franczyza",
      col3: "Nowy",
      col4: "Wykaz placówek handowych_20150101",
    },
    { id: 3, col1: "A99", col2: "Centrala", col3: "Zamknięty" },
    { id: 4, col1: "G99", col2: "Multisambo", col3: "Otwarty" },
  ]);

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

    onSubmit: (values: formikValues, { resetForm }) => {
      let newRow = {
        id: rowsArr.length + 1,
        col1: values.store,
        col2: values.storeType,
        col3: values.status,
        col4: values.info && values.info,
      };
      setRowsArr((prevRows) => [...prevRows, newRow]);
      resetForm();
    },
  });

  const toggleAddShop = () => {
    setAddShop(!addShop);
  };

  const SelectEditStatusCell = (props: GridRenderCellParams) => {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();

    const handleChange = async (event: SelectChangeEvent) => {
      await apiRef.current.setEditCellValue({
        id,
        field,
        value: event.target.value,
      });
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
      await apiRef.current.setEditCellValue({
        id,
        field,
        value: event.target.value,
      });
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
    { field: "col1", headerName: "Sklep", width: 120, editable: true },
    {
      field: "col2",
      headerName: "Typ sklepu",
      renderEditCell: renderSelectEditStoreTypeCell,
      width: 150,
      editable: true,
    },
    {
      field: "col3",
      headerName: "Status",
      renderEditCell: renderSelectEditStatusCell,
      width: 120,
      editable: true,
    },
    { field: "col4", headerName: "Informacje", width: 540, editable: true },
  ];

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
        rows={rowsArr}
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
            sortModel: [{ field: "col1", sort: "asc" }],
          },
        }}
      />
    </Box>
  );
};

export default ShopListPage;
