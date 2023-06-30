import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import { selectErrorJobs, selectJobs } from "../selectors/user";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getJobsWithError, getJobs } from "../actions/UserActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface ReplicationTypes {
  id: number;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const MonitPage = () => {
  const dispatch = useDispatch<any>();
  let jobs: any = useSelector<any>(selectJobs);
  let errorJobs: any = useSelector<any>(selectErrorJobs);
  const [tab, setTab] = useState<number>(0);

  const [replicationRows, setReplicationRows] = useState<ReplicationTypes[]>([
    {
      id: 1,
      col1: "2022-11-13 12:51:23",
      col2: "2022-11-14 12:51:23",
      col3: "24,1",
      col4: "2022-11-14 21:51:23",
    },
  ]);

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const columnsProcess: GridColDef[] = [
    { field: "ID", headerName: "JobID", width: 100 },
    { field: "STORE_NUMBER", headerName: "Sklep", width: 60 },
    {
      field: "QUEUE",
      headerName: "Typ operacji",
      width: 200,
    },
    {
      field: "STATUS",
      headerName: "Status",
      width: 65,
    },
    { field: "TM_START", headerName: "Start Procesu", width: 200 },
    { field: "ERROR_MESSAGE", headerName: "Error", width: 515 },
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

  const handleGetProcessWithErrors = async () => {
    switch (tab) {
      case 0:
        setSnackbar({
          children: "Pobieram procesy - operacja może potrwać kilka minut",
          severity: "success",
        });
        await dispatch(getJobsWithError());
        break;
      case 1:
        setSnackbar({
          children: "Pobieram procesy - operacja może potrwać kilka minut",
          severity: "success",
        });
        await dispatch(getJobs());
        break;
      case 2:
        setSnackbar({
          children:
            "Pobieram dane o replikacji - operacja może potrwać kilka minut",
          severity: "success",
        });
        console.log("test");
        break;
      default:
        break;
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
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
      <Box sx={{ position: "relative" }}>
        <Button
          onClick={handleGetProcessWithErrors}
          sx={{ position: "absolute", top: 5, right: 20, zIndex: 1 }}
        >
          pobierz aktualne dane
        </Button>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label='Procesy z błędem' />
          <Tab label='Wszystkie procesy' />
          <Tab label='Replikacja' />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <Box style={{ height: 580 }}>
            <DataGrid
              rows={errorJobs ? errorJobs : []}
              columns={columnsProcess}
              // hideFooter
              disableColumnMenu={true}
              pageSize={25}
              density={"compact"}
            />
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Box style={{ height: 580 }}>
            <DataGrid
              rows={jobs ? jobs : []}
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
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <DataGrid
            sx={{ height: 110 }}
            rows={replicationRows}
            columns={columnsReplication}
            hideFooter
            disableColumnMenu={true}
            density={"compact"}
          />
        </TabPanel>
      </Box>
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

export default MonitPage;
