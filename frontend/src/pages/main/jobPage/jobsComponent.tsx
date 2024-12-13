import { useState } from "react";
import { Box } from "@mui/material";
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

export const JobsComponent = () => {
  let jobs: JobType[] = useAppSelector(jobsSelector);
  const [openModal, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedAction, setSelectedAction] = useState<
    "delete" | "restart" | ""
  >("");

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  let formatedJobs = jobs.map((job: JobType) => {
    let TM_FORMAT_START = new Date(job.tmStart);
    let TM_FORMAT_RESTART = new Date(job.tmRestart);
    job = { ...job, TM_FORMAT_START, TM_FORMAT_RESTART };
    return job;
  });

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
    { field: "docId", headerName: "DOC_ID", width: 110 },
    { field: "ordered", headerName: "Zlecony przez", width: 200 },
    {
      field: "errorMessage",
      headerName: "Error",
      width: 1200,
      renderCell: (params) => formatErrorMessage(params.row?.errorMessage),
    },
  ];

  return (
    <Box style={{ height: "78vh", minHeight: 560 }}>
      <DataGrid
        sx={{ bgcolor: "background.paper" }}
        rows={jobs ? formatedJobs : []}
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
