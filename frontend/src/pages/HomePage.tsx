import { useState, useEffect } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import api from "../api/api";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { selectBlockReports } from "../selectors/user";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getBlockRaport } from "../actions/UserActions";

const HomePage = () => {
  const dispatch = useDispatch<any>();
  let blockReports: any = useSelector<any>(selectBlockReports);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const buttonList: string[] = [
    "JIRA SKG",
    "WIKI",
    "ICINGA",
    "GRAFANA",
    "WEBLOGIC",
    "DOMAIN HEALTH",
    "ENTERPRISE MANAGER",
  ];

  const eSamboList: string[] = [
    "PRODUKCYJNE",
    "TESTOWE",
    "LABO",
    "DEVELOPERSKIE",
  ];

  const raportList: { name: string; btt: string }[] = [
    { name: "RAPORT PORANNY", btt: "morning" },
    { name: "RAPORT WOLUMETRYKA", btt: "volumetrics" },
  ];

  const seleniumList: { name: string; btt: string }[] = [
    { name: "ŚRODOWISKO DEV", btt: "selenium_dev" },
    { name: "ŚRODOWISKO TEST", btt: "selenium" },
  ];

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleGoToExternalServices = (button: string) => {
    switch (button) {
      case "JIRA SKG":
        window.open(process.env.REACT_APP_JIRA_SKG, "_blank");
        break;
      case "WIKI":
        window.open(process.env.REACT_APP_WIKI, "_blank");
        break;
      case "ICINGA":
        window.open(process.env.REACT_APP_ICINGA, "_blank");
        break;
      case "GRAFANA":
        window.open(process.env.REACT_APP_GRAFANA, "_blank");
        break;
      case "WEBLOGIC":
        window.open(process.env.REACT_APP_WEBLOGIC, "_blank");
        break;
      case "DOMAIN HEALTH":
        window.open(process.env.REACT_APP_DOMAIN_HEALTH, "_blank");
        break;
      case "ENTERPRISE MANAGER":
        window.open(process.env.REACT_APP_ENTERPRISE_MANAGER, "_blank");
        break;
      case "PRODUKCYJNE":
        window.open(process.env.REACT_APP_ESAMBO_PROD, "_blank");
        break;
      case "TESTOWE":
        window.open(process.env.REACT_APP_ESAMBO_TEST, "_blank");
        break;
      case "LABO":
        window.open(process.env.REACT_APP_ESAMBO_LABO, "_blank");
        break;
      case "DEVELOPERSKIE":
        window.open(process.env.REACT_APP_ESAMBO_DEV, "_blank");
        break;
      default:
        break;
    }
  };

  const handleRaportGenerate = async (button: string) => {
    switch (button) {
      case "RAPORT PORANNY":
        await api.get(`/reports/morning`);
        dispatch(getBlockRaport());
        setSnackbar({
          children:
            "Zlecono generacje raportu - raport zostanie wysłany na twojego maila",
          severity: "success",
        });
        break;
      case "RAPORT WOLUMETRYKA":
        await api.get(`/reports/volumetrics`);
        dispatch(getBlockRaport());
        setSnackbar({
          children:
            "Zlecono generacje raportu - raport zostanie wysłany na twojego maila",
          severity: "success",
        });
        break;
      default:
        break;
    }
  };

  const handleTestGenerate = async (button: string) => {
    switch (button) {
      case "ŚRODOWISKO DEV":
        await api.get(`/reports/selenium-dev`);
        dispatch(getBlockRaport());
        setSnackbar({
          children:
            "Uruchomiono selenium - raport zostanie wysłany na twojego maila",
          severity: "success",
        });
        break;
      case "ŚRODOWISKO TEST":
        await api.get(`/reports/selenium`);
        dispatch(getBlockRaport());
        setSnackbar({
          children:
            "Uruchomiono selenium - raport zostanie wysłany na twojego maila",
          severity: "success",
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getBlockRaport());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant='h6'
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            marginBottom: 2,
            marginLeft: 1,
          }}
        >
          Manualne generowanie
        </Typography>
        <Stack direction={"row"} spacing={4}>
          {raportList.map((raport, id) => (
            <Button
              key={id}
              variant='contained'
              size='large'
              style={{ marginBottom: 10, width: 400 }}
              disabled={blockReports.includes(raport.btt)}
              onClick={() => {
                handleRaportGenerate(raport.name);
              }}
            >
              {raport.name}
            </Button>
          ))}
        </Stack>
      </Box>
      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant='h6'
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            marginBottom: 2,
            marginLeft: 1,
          }}
        >
          Testy selenium
        </Typography>
        <Stack direction={"row"} spacing={4}>
          {seleniumList.map((test, id) => (
            <Button
              key={id}
              variant='contained'
              size='large'
              style={{ marginBottom: 10, width: 400 }}
              disabled={blockReports.includes(test.btt)}
              onClick={() => {
                handleTestGenerate(test.name);
              }}
            >
              {test.name}
            </Button>
          ))}
        </Stack>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box>
          <Typography
            variant='h6'
            sx={{
              letterSpacing: 2,
              color: "primary.main",
              marginBottom: 2,
              marginLeft: 1,
            }}
          >
            eSambo
          </Typography>
          <Stack>
            {eSamboList.map((esambo, id) => (
              <Button
                key={id}
                variant='contained'
                size='large'
                style={{ marginBottom: 10, width: 400 }}
                onClick={() => {
                  handleGoToExternalServices(esambo);
                }}
              >
                {esambo}
              </Button>
            ))}
          </Stack>
        </Box>
        <Box sx={{ marginLeft: 4 }}>
          <Typography
            variant='h6'
            sx={{
              letterSpacing: 2,
              color: "primary.main",
              marginBottom: 3,
              marginLeft: 1,
            }}
          >
            Serwisy zewnętrzne
          </Typography>
          <Stack>
            {buttonList.map((button, id) => (
              <Button
                key={id}
                variant='contained'
                size='large'
                style={{ marginBottom: 10, width: 400 }}
                onClick={() => {
                  handleGoToExternalServices(button);
                }}
              >
                {button}
              </Button>
            ))}
          </Stack>
        </Box>
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

export default HomePage;
