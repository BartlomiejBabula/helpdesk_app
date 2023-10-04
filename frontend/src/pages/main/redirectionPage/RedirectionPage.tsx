import { Box, Button, Typography, Stack } from "@mui/material";

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
        display: "flex",
        flexDirection: "row",
        height: "100%",
        position: "relative",
        padding: 2,
        paddingLeft: 5,
      }}
    >
      <Box>
        <Typography
          variant='h6'
          sx={{
            letterSpacing: 2,
            color: "rgba(0, 0, 0, 0.6)",
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
              style={{
                marginBottom: 10,
                width: "28vw",
                minWidth: 300,
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
      <Box sx={{ marginLeft: 8 }}>
        <Typography
          variant='h6'
          sx={{
            letterSpacing: 2,
            color: "rgba(0, 0, 0, 0.6)",
            marginBottom: 2,
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
                width: "28vw",
                minWidth: 300,
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
    </Box>
  );
};

export default RedirectionPage;
