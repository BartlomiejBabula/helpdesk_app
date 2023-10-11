import { Box, Button, Typography, Stack, Paper } from "@mui/material";

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

const RedirectionPage = () => {
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

  return (
    <Box
      sx={{
        height: "100%",
        padding: 2,
      }}
    >
      <Typography
        variant='h6'
        sx={{
          letterSpacing: 2,
          color: "#38373D",
          marginLeft: 1,
          marginBottom: 1,
        }}
      >
        Serwisy
      </Typography>
      <Paper
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "row",
          width: 860,
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography
            variant='subtitle1'
            sx={{
              letterSpacing: 1,
              color: "#38373D",
              marginBottom: 2,
              fontWeight: "medium",
              marginLeft: 1,
            }}
          >
            Środowiska eSambo
          </Typography>
          <Stack>
            {eSamboList.map((esambo, id) => (
              <Button
                key={id}
                variant='contained'
                size='large'
                style={{
                  marginBottom: 10,
                  width: 350,
                  backgroundImage:
                    "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
                }}
                onClick={() => {
                  handleGoToExternalServices(esambo);
                }}
              >
                {esambo}
              </Button>
            ))}
          </Stack>
        </Box>
        <Box sx={{ marginLeft: 10 }}>
          <Typography
            variant='subtitle1'
            sx={{
              letterSpacing: 1,
              color: "#38373D",
              marginBottom: 2,
              fontWeight: "medium",
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
                style={{
                  marginBottom: 10,
                  width: 350,
                  backgroundImage:
                    "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
                }}
                onClick={() => {
                  handleGoToExternalServices(button);
                }}
              >
                {button}
              </Button>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default RedirectionPage;
