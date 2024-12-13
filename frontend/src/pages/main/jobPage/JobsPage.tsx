import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { JobsComponent } from "./jobsComponent";
import { JobsWithErrorComponent } from "./jobsWithErrorComponent";

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

const JobsPage = () => {
  const [tab, setTab] = useState<number>(0);

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
            color: "text.primary",
            marginLeft: 1,
            marginBottom: 1,
          }}
        >
          Monitoring
        </Typography>
        <Tabs value={tab} onChange={handleChange}>
          <Tab sx={{ color: "text.primary" }} label='Wszystkie procesy' />
          <Tab sx={{ color: "text.primary" }} label='Procesy z błędem' />
        </Tabs>
        <TabPanel value={tab} index={1}>
          <JobsWithErrorComponent />
        </TabPanel>
        <TabPanel value={tab} index={0}>
          <JobsComponent />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default JobsPage;
