import {
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  Modal,
  Backdrop,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { selectJobs, selectReplication } from "../../../selectors/user";
import { JobTypes, ReplicationTypes } from "../../../types";
import { formatDate } from "../../../actions/UserActions";
import {
  useAppDispatch,
  useAppSelector,
  Dispatcher,
} from "../../../store/AppStore";
import { getJobs } from "../../../actions/UserActions";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import api from "../../../api/api";

export const Monitoring = () => {
  const dispatch: Dispatcher = useAppDispatch();
  const [openModal, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedAction, setSelectedAction] = useState<
    "delete" | "restart" | ""
  >("");
  const [filteredJobs, setFilteredJobs] = useState<JobTypes[]>();
  let jobs: JobTypes[] = useAppSelector(selectJobs);
  let replication: ReplicationTypes[] = useAppSelector(selectReplication);

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

  const columnsReplication: GridColDef[] = [
    {
      field: "PROD_TIME",
      headerName: "Aktualna godzina",
      width: 220,
    },
    {
      field: "REPLICATION_TIME",
      headerName: "Zreplikowana godzina",
      width: 220,
    },
    {
      field: "DELAY_SECONDS",
      headerName: "Opóźnienie",
      width: 220,
    },
  ];

  useEffect(() => {
    if (jobs !== undefined) {
      let compareDate = new Date(Date.now() - 3600 * 1000 * 240); // current day -240 h / 10days
      let compareDate2 = new Date(Date.now() - 3600 * 1000 * 0.25);
      let compareDate3 = new Date(Date.now() - 3600 * 1000 * 0.5);
      let filer = jobs.filter(
        (job: JobTypes) =>
          formatDate(
            job.TM_FORMAT_RESTART !== undefined
              ? job.TM_FORMAT_RESTART
              : new Date(0)
          ) !== "01.01.1970 01:00:00" &&
          formatDate(
            job.TM_FORMAT_START !== undefined
              ? job.TM_FORMAT_START
              : new Date(0)
          ) !== "01.01.1970 01:00:00" &&
          new Date(job.TM_CREATE) > compareDate &&
          new Date(job.TM_RESTART) < compareDate2 &&
          new Date(job.TM_START) < compareDate3
      );
      setFilteredJobs(filer);
    }
  }, [jobs, replication]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

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
    console.log("End joba:", row.ID);
    handleCloseModal();
  };

  const handleConfirmAction = () => {
    if (selectedAction === "delete") {
      handleEndJob(selectedRow);
    }
    if (selectedAction === "restart") {
      handleRestartJob(selectedRow);
    }
  };

  return (
    <Paper sx={{ padding: 2, paddingBottom: 3 }}>
      <Typography
        variant='subtitle1'
        sx={{
          letterSpacing: 1,
          color: "#38373D",
          marginBottom: 1,
          fontWeight: "medium",
          marginLeft: 1,
        }}
      >
        Długo przetwarzające się procesy
      </Typography>
      <DataGrid
        style={{ height: "40vh", minHeight: 260 }}
        rows={filteredJobs ? filteredJobs : []}
        columns={columnsProcess}
        disableColumnMenu={true}
        initialState={{
          sorting: {
            sortModel: [{ field: "col4", sort: "asc" }],
          },
        }}
        density={"compact"}
      />
      <Typography
        variant='subtitle1'
        sx={{
          marginTop: 4,
          letterSpacing: 1,
          color: "#38373D",
          marginBottom: 1,
          fontWeight: "medium",
          marginLeft: 1,
        }}
      >
        Replikacja
      </Typography>
      <DataGrid
        getRowId={(row) => row.ID}
        sx={{ height: 76.5 }}
        rows={replication ? replication : []}
        columns={columnsReplication}
        hideFooter
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
    </Paper>
  );
};
