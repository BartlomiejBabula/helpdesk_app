import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { AlertProps } from "@mui/material/Alert";
import { getJobs } from "../../../actions/UserActions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { JobsComponent } from "./jobsComponent";
import { JobsWithErrorComponent } from "./jobsWithErrorComponent";
import { Dispatcher, useAppDispatch } from "../../../store/AppStore";
import SnackbarAlert from "../../../components/SnackbarAlert";

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
  const dispatch: Dispatcher = useAppDispatch();
  const [tab, setTab] = useState<number>(0);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleGetActualData = () => {
    dispatch(getJobs());
    setSnackbar({
      children: "Pobieram aktualne dane - operacja może potrwać kilka minut",
      severity: "success",
    });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Box sx={{ marginBottom: 1 }}>
        <Typography
          variant='h6'
          sx={{
            letterSpacing: 2,
            color: "#38373D",
            marginLeft: 1,
            marginBottom: 1,
          }}
        >
          Monitoring
        </Typography>
        <Button
          onClick={handleGetActualData}
          sx={{ position: "absolute", top: 15, right: 20, zIndex: 1 }}
        >
          pobierz aktualne dane
        </Button>
        <Tabs value={tab} onChange={handleChange}>
          <Tab sx={{ color: "#38373D" }} label='Wszystkie procesy' />
          <Tab sx={{ color: "#38373D" }} label='Procesy z błędem' />
        </Tabs>
        <TabPanel value={tab} index={1}>
          <JobsWithErrorComponent />
        </TabPanel>
        <TabPanel value={tab} index={0}>
          <JobsComponent />
        </TabPanel>
      </Box>
      <SnackbarAlert alert={snackbar} />
    </Box>
  );
};

export default MonitPage;
