import { useState, useEffect } from "react";
import { Box, Fade, Modal, Backdrop, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { selectJobs } from "../../../selectors/user";
import { getJobs } from "../../../actions/UserActions";
import {
  useAppSelector,
  Dispatcher,
  useAppDispatch,
} from "../../../store/AppStore";
import { JobTypes } from "../../../types";
import { formatDate } from "../../../actions/UserActions";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import api from "../../../api/api";

export const JobsWithErrorComponent = () => {
  const dispatch: Dispatcher = useAppDispatch();
  const [openModal, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedAction, setSelectedAction] = useState<
    "delete" | "restart" | ""
  >("");
  const [filteredJobs, setFilteredJobs] = useState<JobTypes[]>();
  let jobs: JobTypes[] = useAppSelector(selectJobs);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const columnsProcess: GridColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Akcje",
      width: 80,
      renderCell: (item: any) => {
        return (
          item.row.QUEUE === "GenerateReportQueue" &&
          item.row.STATUS === "B" && (
            <>
              <GridActionsCellItem
                icon={
                  <RestartAltIcon
                    sx={{
                      color: "#4098cf",
                    }}
                  />
                }
                label='Restart'
                onClick={() => {
                  setSelectedRow(item.row);
                  handleOpenModal();
                  setSelectedAction("restart");
                }}
              />
              <GridActionsCellItem
                icon={<DeleteIcon sx={{ color: "red" }} />}
                label='Delete'
                onClick={() => {
                  setSelectedRow(item.row);
                  handleOpenModal();
                  setSelectedAction("delete");
                }}
              />
            </>
          )
        );
      },
    },
    { field: "ID", headerName: "JobID", width: 110 },
    { field: "STORE_NUMBER", headerName: "Sklep", width: 60 },
    {
      field: "QUEUE",
      headerName: "Typ operacji",
      width: 200,
    },
    {
      field: "STATUS",
      headerName: "Status",
      width: 65,
    },
    {
      field: "TM_FORMAT_START",
      headerName: "Start Procesu",
      width: 200,
      headerClassName: "data-grid-header",
      type: "date",
      renderCell: (params) => formatDate(params.row?.TM_FORMAT_START),
    },
    {
      field: "TM_FORMAT_RESTART",
      headerName: "Restart Procesu",
      width: 200,
      headerClassName: "data-grid-header",
      type: "date",
      renderCell: (params) => formatDate(params.row?.TM_FORMAT_RESTART),
    },
    { field: "ERROR_MESSAGE", headerName: "Error", width: 560 },
  ];

  const handleRestartJob = (row: any) => {
    api
      .post("/job/restart", { id: row.ID })
      .then(() => {
        dispatch(getJobs());
        handleCloseModal();
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const handleEndJob = (row: any) => {
    api
      .post("/job/end", { id: row.ID })
      .then(() => {
        dispatch(getJobs());
        handleCloseModal();
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const handleConfirmAction = () => {
    if (selectedAction === "delete") {
      handleEndJob(selectedRow);
    }
    if (selectedAction === "restart") {
      handleRestartJob(selectedRow);
    }
  };

  useEffect(() => {
    if (jobs !== undefined) {
      let filer = jobs.filter((job: JobTypes) => job.STATUS === "B");
      setFilteredJobs(filer);
    }
  }, [jobs]);

  return (
    <Box style={{ height: "78vh", minHeight: 560 }}>
      <DataGrid
        style={{ backgroundColor: "white" }}
        rows={filteredJobs ? filteredJobs : []}
        columns={columnsProcess}
        disableColumnMenu={true}
        density={"compact"}
      />
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
                marginBottom: 1,
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
    </Box>
  );
};
