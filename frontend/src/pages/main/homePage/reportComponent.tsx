import { useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import api from "../../../api/api";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { selectBlockReports } from "../../../selectors/user";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getBlockRaport } from "../../../actions/UserActions";

const raportList: { name: string; btt: string }[] = [
  { name: "RAPORT PORANNY", btt: "morning" },
  { name: "RAPORT WOLUMETRYKA", btt: "volumetrics" },
];

export const Report = () => {
  const dispatch = useDispatch<any>();
  let blockReports: any = useSelector<any>(selectBlockReports);
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
      default:
        break;
    }
  };

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography
        variant='h6'
        sx={{
          letterSpacing: 2,
          color: "rgba(0, 0, 0, 0.6)",
          marginBottom: 2,
          marginLeft: 1,
        }}
      >
        Manualne generowanie raportów
      </Typography>
      <Stack direction={"row"} spacing={4}>
        {raportList.map((raport, id) => (
          <Button
            key={id}
            variant='contained'
            size='large'
            style={{
              marginBottom: 10,
              width: 400,
              backgroundImage:
                "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
            }}
            disabled={blockReports ? blockReports.includes(raport.btt) : null}
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
