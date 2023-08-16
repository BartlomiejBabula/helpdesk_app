import { useState } from "react";
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

const seleniumList: { name: string; btt: string }[] = [
  { name: "ŚRODOWISKO DEV", btt: "selenium_dev" },
  { name: "ŚRODOWISKO TEST", btt: "selenium" },
];

export const Selenium = () => {
  const dispatch: Dispatcher = useAppDispatch();
  let blockReports: string[] = useAppSelector(selectBlockReports);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

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
        Testy selenium
      </Typography>
      <Stack direction={"row"} spacing={4}>
        {seleniumList.map((test, id) => (
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
            disabled={blockReports?.includes(test.btt) ? true : false}
            onClick={() => {
              handleTestGenerate(test.name);
            }}
          >
            {test.name}
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
