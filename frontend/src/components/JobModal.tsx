import { Box, Typography, Button, Fade, Modal, Backdrop } from "@mui/material";
import api from "../api/api";
import { useState } from "react";
import { AlertProps } from "@mui/material/Alert";
import SnackbarAlert from "./SnackbarAlert";
import { useAppDispatch } from "../redux/AppStore";
import { getJobs } from "../redux/jobs/getJobs";

interface JobModalType {
  row: any;
  openModal: boolean;
  handleCloseModal: any;
  selectedAction: "delete" | "restart" | "";
}

export const JobModal = ({
  row,
  openModal,
  handleCloseModal,
  selectedAction,
}: JobModalType) => {
  const dispatch = useAppDispatch();
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleConfirmAction = () => {
    if (selectedAction === "delete") {
      handleEndJob(row);
    }
    if (selectedAction === "restart") {
      handleRestartJob(row);
    }
  };

  const handleRestartJob = (row: any) => {
    api
      .post("/job/restart", { id: row.ID })
      .then(() => {
        dispatch(getJobs());
        handleCloseModal();
        setSnackbar({
          children: "Zrestartowano zadanie",
          severity: "success",
        });
      })
      .catch((error: Error) => {
        console.log(error);
        setSnackbar({
          children: "Wystąpił błąd w operacji",
          severity: "error",
        });
      });
    handleCloseModal();
  };

  const handleEndJob = (row: any) => {
    api
      .post("/job/end", { id: row.ID })
      .then(() => {
        dispatch(getJobs());
        handleCloseModal();
        setSnackbar({
          children: "Zakończono zadanie",
          severity: "success",
        });
      })
      .catch((error: Error) => {
        console.log(error);
        setSnackbar({
          children: "Wystąpił błąd w operacji",
          severity: "error",
        });
      });
    handleCloseModal();
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 425,
              borderRadius: 1,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant='h6'
              sx={{
                marginBottom: 2,
              }}
            >
              Czy chcesz wykonać{" "}
              {selectedAction === "delete" ? "END" : "RESTART"} joba?
            </Typography>
            <Box>
              <Button
                variant='contained'
                style={{
                  width: 70,
                  backgroundImage:
                    "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
                }}
                onClick={() => {
                  handleConfirmAction();
                }}
              >
                TAK
              </Button>
              <Button
                variant='contained'
                style={{
                  marginLeft: 20,
                  width: 70,
                  backgroundImage:
                    "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
                }}
                onClick={() => {
                  handleCloseModal();
                }}
              >
                NIE
              </Button>
            </Box>
            <Typography
              variant='subtitle2'
              sx={{ color: "red", marginTop: 3, fontSize: 14 }}
            >
              Przed wykonaniem operacji upewnij się że masz pobraną aktualną
              listę jobów.
            </Typography>
          </Box>
        </Fade>
      </Modal>
      <SnackbarAlert alert={snackbar} />
    </>
  );
};
