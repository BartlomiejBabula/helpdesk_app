import { useState, useEffect } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import api from "../../../api/api";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { selectBlockReports } from "../../../selectors/user";
import { getBlockRaport } from "../../../actions/UserActions";
import {
  Dispatcher,
  useAppDispatch,
  useAppSelector,
} from "../../../store/AppStore";

const raportList: { name: string; btt: string }[] = [
  { name: "RAPORT PORANNY", btt: "morning" },
  { name: "RAPORT WOLUMETRYKA", btt: "volumetrics" },
  { name: "RAPORT SELENIUM", btt: "selenium" },
];

export const Report = () => {
  const dispatch: Dispatcher = useAppDispatch();
  let blockReports: string[] = useAppSelector(selectBlockReports);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

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
      case "RAPORT SELENIUM":
        await api.get(`/reports/selenium`); // dla dev /reports/selenium-dev
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
    dispatch(getBlockRaport());
  }, []);

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography
        variant='subtitle1'
        sx={{
          marginLeft: 1,
          letterSpacing: 1,
          color: "rgba(0, 0, 0, 0.6)",
          marginBottom: 1,
          fontWeight: "medium",
        }}
      >
        Generowanie ręczne raportów
      </Typography>
      <Stack direction={"row"} spacing={4}>
        {raportList.map((raport, id) => (
          <Button
            key={id}
            variant='contained'
            size='large'
            style={{
              marginBottom: 10,
              width: 250,
              backgroundImage:
                "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
            }}
            disabled={blockReports?.includes(raport.btt) ? true : false}
            onClick={() => {
              handleRaportGenerate(raport.name);
            }}
          >
            {raport.name}
          </Button>
        ))}
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
      </Stack>
    </Box>
  );
};
