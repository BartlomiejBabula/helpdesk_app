import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatDate } from "../../../function/formatingDataFunction";
import api from "../../../api/api";
import { LogType } from "../../../redux/types";

const LoggerPage = () => {
  const [logs, setLogs] = useState([]);

  const getLogs = () => {
    api.get(`/logger/`).then((response) => {
      let formatedLogs = response.data.map((log: LogType) => {
        let formatedCreatedAt = new Date(log.createdAt);
        formatedCreatedAt.setHours(formatedCreatedAt.getHours() + 1);
        log = { ...log, formatedCreatedAt };
        return log;
      });
      setLogs(formatedLogs);
    });
  };

  useEffect(() => {
    getLogs();
  }, []);

  const columnsProcess: GridColDef[] = [
    {
      field: "formatedCreatedAt",
      headerName: "Data",
      width: 160,
      headerClassName: "data-grid-header",
      type: "date",
      renderCell: (params) => formatDate(params.row?.formatedCreatedAt),
    },
    { field: "status", headerName: "Status", width: 120 },
    { field: "task", headerName: "Proces", width: 230 },
    { field: "taskId", headerName: "ID", width: 300 },
    {
      field: "orderedBy",
      headerName: "Zlecony przez",
      width: 160,
    },
    {
      field: "description",
      headerName: "Opis",
      width: 1200,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        height: "100vh",
      }}
    >
      <Box
        sx={{
          marginBottom: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
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
          Logger Procesów
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            width: 220,
          }}
          onClick={() => {
            setLogs([]);
            getLogs();
          }}
        >
          Pobierz aktualne dane
        </Button>
      </Box>
      <DataGrid
        sx={{ bgcolor: "background.paper", height: "90vh" }}
        rows={logs}
        columns={columnsProcess}
        density={"compact"}
        loading={logs.length <= 0}
        initialState={{
          sorting: {
            sortModel: [{ field: "formatedCreatedAt", sort: "desc" }],
          },
        }}
      />
    </Box>
  );
};

export default LoggerPage;
