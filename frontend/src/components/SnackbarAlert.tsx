import { useState, useEffect } from "react";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

interface SnacbackAlertType {
  alert: Pick<AlertProps, "children" | "severity"> | null;
}

const SnackbarAlert = ({ alert }: SnacbackAlertType) => {
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  useEffect(() => {
    setSnackbar(alert);
  }, [alert]);

  const handleCloseSnackbar = () => setSnackbar(null);

  return !!snackbar ? (
    <Snackbar
      open
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={handleCloseSnackbar}
      autoHideDuration={3000}
    >
      <Alert {...snackbar} onClose={handleCloseSnackbar} />
    </Snackbar>
  ) : (
    <></>
  );
};

export default SnackbarAlert;
