import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import {
  formatDate,
  formatErrorMessage,
} from "../../../function/formatingDataFunction";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { JobModal } from "../../../components/JobModal";
import { useAppSelector } from "../../../redux/AppStore";
import { jobsSelector } from "../../../redux/jobs/JobsSlice";
import { JobType } from "../../../redux/types";

export const Monitoring = () => {
  const [openModal, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedAction, setSelectedAction] = useState<
    "delete" | "restart" | ""
  >("");
  const [filteredJobs, setFilteredJobs] = useState<JobType[]>();
  const jobs = useAppSelector(jobsSelector);

  const columnsProcess: GridColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Akcje",
      width: 80,
      renderCell: (item: any) => {
        return (
          item.row.queue === "GenerateReportQueue" &&
          item.row.status === "B" && (
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
    { field: "jobId", headerName: "JobID", width: 110 },
    { field: "storeNumber", headerName: "Sklep", width: 60 },
    {
      field: "queue",
      headerName: "Typ operacji",
      width: 200,
    },
    {
      field: "status",
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
    {
      field: "errorMessage",
      headerName: "Error",
      width: 1260,
      renderCell: (params) => formatErrorMessage(params.row?.errorMessage),
    },
  ];

  useEffect(() => {
    if (jobs !== undefined) {
      let compareDate = new Date(Date.now() - 3600 * 1000 * 240); // current day -240 h / 10days
      let compareDate2 = new Date(Date.now() - 3600 * 1000 * 0.25);
      let compareDate3 = new Date(Date.now() - 3600 * 1000 * 0.5);
      let filter = jobs.filter(
        (job: JobType) =>
          (formatDate(
            new Date(job.tmRestart) !== undefined
              ? new Date(job.tmRestart)
              : new Date(0)
          ) !== "01.01.1970 01:00:00" &&
            formatDate(
              new Date(job.tmStart) !== undefined
                ? new Date(job.tmStart)
                : new Date(0)
            ) !== "01.01.1970 01:00:00" &&
            new Date(job.tmCreate) > compareDate &&
            new Date(job.tmRestart) < compareDate2 &&
            new Date(job.tmStart) < compareDate3) ||
          (job.errorMessage !== null &&
            new Date(job.tmCreate) > compareDate &&
            new Date(job.tmCreate) < compareDate2 &&
            formatDate(
              new Date(job.tmStart) !== undefined
                ? new Date(job.tmStart)
                : new Date(0)
            ) !== "01.01.1970 01:00:00")
      );
      let filteredArray = filter.map((job: JobType) => {
        let TM_FORMAT_START = new Date(job.tmStart);
        let TM_FORMAT_RESTART = new Date(job.tmRestart);
        job = { ...job, TM_FORMAT_START, TM_FORMAT_RESTART };
        return job;
      });
      setFilteredJobs(filteredArray);
    }
  }, [jobs]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <Box>
      <Typography
        variant='subtitle1'
        sx={{
          letterSpacing: 1,
          color: "text.primary",
          marginBottom: 1,
          fontWeight: "medium",
          marginLeft: 1,
        }}
      >
        Długo przetwarzające się procesy
      </Typography>
      <DataGrid
        sx={{ height: "54vh", minHeight: 360, bgcolor: "background.paper" }}
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
      <JobModal
        row={selectedRow}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        selectedAction={selectedAction}
      />
    </Box>
  );
};
