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
import { AlertProps } from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { AddShop } from "./addStoreComponent";
import SnackbarAlert from "../../../components/SnackbarAlert";
import { useAppDispatch } from "../../../redux/AppStore";
import { StoreType } from "../../../redux/types";
import { storesSelector } from "../../../redux/stores/StoresSlice";
import { editStore } from "../../../redux/stores/editStore";

const ShopListPage = () => {
  const dispatch = useAppDispatch();
  const storeList: StoreType[] = useSelector(storesSelector);
  const [addStore, setAddStore] = useState(false);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

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
        size="small"
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
        size="small"
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
    async (editRow: StoreType) => {
      let newStore: StoreType = {
        _id: editRow._id,
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

  function getRowId(row: StoreType) {
    if (row._id !== undefined) {
      return row._id;
    } else return row.storeNumber;
  }

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
        variant="h6"
        sx={{
          letterSpacing: 2,
          color: "text.primary",
          marginLeft: 1,
          marginBottom: 1,
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
      <Box
        style={{
          height: addStore ? "65vh" : "100vh",
          minHeight: addStore ? 442 : 602,
          paddingTop: 1,
        }}
      >
        <DataGrid
          sx={{ bgcolor: "background.paper" }}
          rows={storeList}
          getRowId={getRowId}
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
      </Box>
      <SnackbarAlert alert={snackbar} />
    </Box>
  );
};

export default ShopListPage;
