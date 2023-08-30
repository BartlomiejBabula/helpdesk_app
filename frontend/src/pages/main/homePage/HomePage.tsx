import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { getBlockRaport } from "../../../actions/UserActions";
import { Report } from "./reportComponent";
import { Dispatcher, useAppDispatch } from "../../../store/AppStore";
import { Monitoring } from "./monitComponent";
import { getJobs, getReplication } from "../../../actions/UserActions";

const HomePage = () => {
  const dispatch: Dispatcher = useAppDispatch();
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  useEffect(() => {
    dispatch(getBlockRaport());
    dispatch(getJobs());
    dispatch(getReplication());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getBlockRaport());
      dispatch(getJobs());
      dispatch(getReplication());
    }, 60000 * 2);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleGetActualData = () => {
    dispatch(getJobs());
    dispatch(getReplication());
    setSnackbar({
      children: "Pobieram aktualne dane - operacja może potrwać kilka minut",
      severity: "success",
    });
  };

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
      <Box sx={{ flexDirection: "row", marginBottom: 3 }}>
        <Typography
          variant='h6'
          sx={{
            letterSpacing: 2,
            color: "rgba(0, 0, 0, 0.6)",
            marginLeft: 1,
          }}
        >
          Centrum dowodzenia
        </Typography>
        <Button
          onClick={handleGetActualData}
          sx={{ position: "absolute", top: 15, right: 20, zIndex: 1 }}
        >
          pobierz aktualne dane
        </Button>
      </Box>
      <Monitoring />
      <Report />
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

export default HomePage;
