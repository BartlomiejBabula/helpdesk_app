import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface ArrayTypes {
  id: number;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5?: string;
}

interface ReplicationTypes {
  id: number;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

const MonitPage = () => {
  const [processRows, setProcessRows] = useState<ArrayTypes[]>([
    {
      id: 1,
      col1: "A88",
      col2: "PerformOperationQueue",
      col3: "B",
      col4: "2022-11-13 12:51:23",
      col5: "Error 1721. There is a problem with this Windows Installer package. A program required for this install to complete could not be run. Contact your support or package vendor",
    },
    {
      id: 2,
      col1: "A53",
      col2: "SentEdiQueue",
      col3: "P",
      col4: "2022-12-13 23:51:23",
      col5: "Error 1721. There is a problem with this Windows Installer package. A program required for this install to complete could not be run. Contact your support or package vendor",
    },
    {
      id: 3,
      col1: "A99",
      col2: "SentEdiQueue",
      col3: "P",
      col4: "2022-12-03 14:51:23",
      col5: "Error 1721. There is a problem with this Windows Installer package. A program required for this install to complete could not be run. Contact your support or package vendor",
    },
    {
      id: 4,
      col1: "G99",
      col2: "PerformOperationQueue",
      col3: "W",
      col4: "2022-12-13 22:51:23",
      col5: "Error 1721. There is a problem with this Windows Installer package. A program required for this install to complete could not be run. Contact your support or package vendor",
    },
  ]);
  const [replicationRows, setReplicationRows] = useState<ReplicationTypes[]>([
    {
      id: 1,
      col1: "2022-11-13 12:51:23",
      col2: "2022-11-14 12:51:23",
      col3: "24,1",
      col4: "2022-11-14 21:51:23",
    },
  ]);

  const columnsProcess: GridColDef[] = [
    { field: "col1", headerName: "Sklep", width: 120 },
    {
      field: "col2",
      headerName: "Typ operacji",
      width: 200,
    },
    {
      field: "col3",
      headerName: "Status",
      width: 70,
    },
    { field: "col4", headerName: "Start Procesu", width: 180 },
    { field: "col5", headerName: "Error", width: 540 },
  ];

  const columnsReplication: GridColDef[] = [
    { field: "col1", headerName: "Zreplikowana godzina", width: 220 },
    {
      field: "col2",
      headerName: "Aktualna godzina",
      width: 220,
    },
    {
      field: "col3",
      headerName: "Ilość godzin opóźnienia",
      width: 220,
    },
    {
      field: "col4",
      headerName: "Godzina aktualizacji danych",
      width: 220,
    },
  ];

  const handleGetProcessWithErrors = () => {
    alert("pobieram procesy z błędami");
  };

  const handleGetReplication = () => {
    alert("pobieram dane o replikacji");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: 2,
      }}
    >
      <Box sx={{ position: "relative", height: "80%" }}>
        <Button
          onClick={handleGetProcessWithErrors}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          pobierz aktywne procesy z błędemi
        </Button>
        <Typography
          variant='h6'
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            marginBottom: 1,
            marginLeft: 1,
          }}
        >
          Procesy z błędem
        </Typography>
        <DataGrid
          rows={processRows}
          columns={columnsProcess}
          // hideFooter
          disableColumnMenu={true}
          initialState={{
            sorting: {
              sortModel: [{ field: "col4", sort: "asc" }],
            },
          }}
          pageSize={25}
          density={"compact"}
        />
      </Box>
      <Box sx={{ position: "relative", height: "25%", marginTop: 15 }}>
        <Button
          onClick={handleGetReplication}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          pobierz aktualne dane o replikacji
        </Button>
        <Typography
          variant='h6'
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            marginBottom: 1,
            marginLeft: 1,
          }}
        >
          Replikacja
        </Typography>
        <DataGrid
          sx={{ height: 77 }}
          rows={replicationRows}
          columns={columnsReplication}
          hideFooter
          disableColumnMenu={true}
          density={"compact"}
        />
      </Box>
    </Box>
  );
};

export default MonitPage;
