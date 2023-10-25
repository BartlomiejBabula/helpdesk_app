import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { AlertProps } from "@mui/material/Alert";
import { getBlockRaport } from "../../../actions/UserActions";
import { Report } from "./reportComponent";
import { Dispatcher, useAppDispatch } from "../../../store/AppStore";
import { Monitoring } from "./monitComponent";
import { getJobs, getReplication } from "../../../actions/UserActions";
import api, { destroyToken, saveToken, setAuthHeader } from "../../../api/api";
import SnackbarAlert from "../../../components/SnackbarAlert";

const HomePage = () => {
  const dispatch: Dispatcher = useAppDispatch();
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const refreshToken = localStorage.getItem("refresh");
      api
        .post("/refresh-token", {
          refreshToken: refreshToken,
        })
        .then((response) => {
          saveToken(response);
          setAuthHeader(response.data.token, refreshToken);
          dispatch(getBlockRaport());
          dispatch(getJobs());
          dispatch(getReplication());
        })
        .catch((error) => {
          destroyToken();
          if (error.response.data === "Błędny refresh token - sesja wygasła") {
            window.location.replace("/");
          }
        });
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
        padding: 2,
      }}
    >
      <Box sx={{ marginBottom: 2 }}>
        <Typography
          variant='h6'
          sx={{
            letterSpacing: 2,
            color: "#38373D",
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
      <SnackbarAlert alert={snackbar} />
    </Box>
  );
};

export default HomePage;
