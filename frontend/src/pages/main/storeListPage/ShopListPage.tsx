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
import { Box, Button, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import { selectStoreList } from "../../../selectors/user";
import { useSelector } from "react-redux";
import { editStore } from "../../../actions/UserActions";
import { AddShop } from "./addStoreComponent";
import { StoreTypes } from "../../../types";
import { Dispatcher, useAppDispatch } from "../../../store/AppStore";

const ShopListPage = () => {
  const dispatch: Dispatcher = useAppDispatch();
  let storeList: StoreTypes[] = useSelector(selectStoreList);
  const [addStore, setAddStore] = useState(false);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const toggleAddStore = () => {
    setAddStore(!addStore);
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
    { field: "storeNumber", headerName: "Sklep", width: 120 },
    {
      field: "storeType",
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
      field: "information",
      headerName: "Informacje",
      width: 540,
      editable: true,
    },
  ];

  const processRowUpdate = React.useCallback(
    async (editRow: GridRowModel) => {
      let newStore: StoreTypes = {
        id: editRow.id,
        storeNumber: editRow.storeNumber,
        storeType: editRow.storeType,
        status: editRow.status,
        information:
          editRow.information === undefined ? "" : editRow.information,
      };

      await dispatch(editStore(newStore));
      setSnackbar({
        children: "Zapisano zmiany",
        severity: "success",
      });
      return editRow;
    },
    [dispatch]
  );

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
        paddingLeft: 5,
      }}
    >
      <Typography
        variant='h6'
        sx={{
          letterSpacing: 2,
          color: "rgba(0, 0, 0, 0.6)",
          marginLeft: 1,
          marginBottom: 2,
        }}
      >
        Lista Sklepów
      </Typography>
      <Button
        sx={{ position: "absolute", top: 15, right: 15 }}
        onClick={toggleAddStore}
      >
        Dodaj sklep
      </Button>
      {addStore && <AddShop />}
      <DataGrid
        rows={storeList}
        columns={columns}
        density={"compact"}
        components={{ Toolbar: GridToolbar }}
        experimentalFeatures={{ newEditingApi: true }}
        disableColumnMenu={true}
        disableDensitySelector={true}
        disableColumnSelector={true}
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
