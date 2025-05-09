import { Box, Button, Typography, Stack, Paper } from "@mui/material";

const buttonList: string[] = [
  "JIRA SKG",
  "WIKI",
  "ICINGA",
  "GRAFANA",
  "ZABBIX",
  "WEBLOGIC",
  "DOMAIN HEALTH",
  "ENTERPRISE MANAGER",
];

const eSamboList: string[] = [
  "PRODUKCYJNE",
  "TESTOWE",
  "LABO",
  "DEVELOPERSKIE",
  "CSB",
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
      case "ZABBIX":
        window.open(process.env.REACT_APP_ZABBIX, "_blank");
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
      case "CSB":
        window.open(process.env.REACT_APP_CSB, "_blank");
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
          color: "text.primary",
          marginLeft: 1,
          marginBottom: 1,
        }}
      >
        Serwisy
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", width: 860 }}>
        <Paper
          variant='outlined'
          sx={{
            padding: 2,
            width: 400,
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{
              letterSpacing: 1,
              color: "text.primary",
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
                 color="secondary"
                style={{
                  marginBottom: 10,
                  width: 330,
                }}
                onClick={() => {
                  handleGoToExternalServices(esambo);
                }}
              >
                {esambo}
              </Button>
            ))}
          </Stack>
        </Paper>
        <Paper
          variant='outlined'
          sx={{
            marginLeft: 5,
            padding: 2,
            width: 400,
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{
              letterSpacing: 1,
              color: "text.primary",
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
                color="secondary"
                style={{
                  marginBottom: 10,
                  width: 330,
                }}
                onClick={() => {
                  handleGoToExternalServices(button);
                }}
              >
                {button}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default RedirectionPage;
