import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import { useDispatch } from "react-redux";
import {
  getJobsWithError,
  getJobs,
  getReplication,
} from "../../../actions/UserActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { JobsComponent } from "./jobsComponent";
import { JobsWithErrorComponent } from "./jobsWithErrorComponent";
import { ReplicationComponent } from "./replicationComponent";

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
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const MonitPage = () => {
  const dispatch = useDispatch<any>();
  const [tab, setTab] = useState<number>(0);

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  useEffect(() => {
    dispatch(getJobsWithError());
    dispatch(getJobs());
    // dispatch(getReplication());
  }, []);

  const handleCloseSnackbar = () => setSnackbar(null);

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
        await dispatch(getReplication());
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
          <JobsWithErrorComponent />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <JobsComponent />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <ReplicationComponent />
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
