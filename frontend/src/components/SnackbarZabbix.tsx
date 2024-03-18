import { useState, useEffect } from "react";
import Alert, { AlertProps } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatDate } from "./../function/formatingDataFunction";
const SnackbarZabbix = () => {
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const [heightColumn, setHeightColumn] = useState(200);

  let test = [
    {
      id: 1,
      server: "CR_PL-S951esamDB",
      info: "Apache: Failed to fetch status page (or no data for 30m)",
      time: "2024-01-09T15:10:22.000Z",
      severity: "Warning",
    },
  ];

  const columnsProcess: GridColDef[] = [
    {
      field: "id",
      hide: true,
    },
    { field: "server", headerName: "Serwer", width: 200, sortable: false },
    {
      field: "severity",
      headerName: "Severity",
      width: 100,
      sortable: false,
    },
    {
      field: "time",
      headerName: "Czas wystąpienia",
      width: 170,
      renderCell: (params) => formatDate(params.row?.time),
      sortable: false,
    },
    { field: "info", headerName: "Info", width: 500, sortable: false },
  ];

  useEffect(() => {
    setSnackbar({
      children: "Pobieram aktualne dane - operacja może potrwać kilka minut",
      severity: "error",
    });
    if (test.length * 50 < 200) setHeightColumn(120);
    if (test.length * 50 > 800) setHeightColumn(800);
    if (test.length * 50 < 800 && test.length * 50 > 200)
      setHeightColumn(test.length * 50);
  }, []);

  const handleCloseSnackbar = () => setSnackbar(null);

  return !!snackbar ? (
    <Snackbar
      open
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleCloseSnackbar}
    >
      <Alert
        variant='outlined'
        severity='error'
        onClose={handleCloseSnackbar}
        sx={{
          backgroundColor: "white",
          width: 1110,
        }}
      >
        <AlertTitle sx={{ mb: 4 }}>
          ZABBIX sygnalizuje problem z eSambo
        </AlertTitle>
        <DataGrid
          sx={{
            border: 2,
            borderColor: "#DCDCDC",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            backgroundColor: "white",
            height: heightColumn,
            width: 1000,
            marginBottom: 4,
          }}
          getRowId={(row) => {
            return row.id;
          }}
          rows={test}
          columns={columnsProcess}
          disableColumnMenu={true}
          disableDensitySelector={true}
          disableColumnSelector={true}
          hideFooter={true}
          density={"compact"}
        />
      </Alert>
    </Snackbar>
  ) : (
    <></>
  );
};

export default SnackbarZabbix;
