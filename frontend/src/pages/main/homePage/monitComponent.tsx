import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { selectJobs } from "../../../selectors/user";
import { JobTypes } from "../../../types";
import { formatDate, formatErrorMessage } from "../../../actions/UserActions";
import { useAppSelector } from "../../../store/AppStore";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { JobModal } from "../../../components/JobModal";

export const Monitoring = () => {
  const [openModal, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedAction, setSelectedAction] = useState<
    "delete" | "restart" | ""
  >("");
  const [filteredJobs, setFilteredJobs] = useState<JobTypes[]>();
  let jobs: JobTypes[] = useAppSelector(selectJobs);

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
    {
      field: "ERROR_MESSAGE",
      headerName: "Error",
      width: 1260,
      renderCell: (params) => formatErrorMessage(params.row?.ERROR_MESSAGE),
    },
  ];

  useEffect(() => {
    if (jobs !== undefined) {
      let compareDate = new Date(Date.now() - 3600 * 1000 * 240); // current day -240 h / 10days
      let compareDate2 = new Date(Date.now() - 3600 * 1000 * 0.25);
      let compareDate3 = new Date(Date.now() - 3600 * 1000 * 0.5);
      let filer = jobs.filter(
        (job: JobTypes) =>
          (formatDate(
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
            new Date(job.TM_START) < compareDate3) ||
          (job.ERROR_MESSAGE !== null &&
            new Date(job.TM_CREATE) > compareDate &&
            new Date(job.TM_CREATE) < compareDate2 &&
            formatDate(
              job.TM_FORMAT_START !== undefined
                ? job.TM_FORMAT_START
                : new Date(0)
            ) !== "01.01.1970 01:00:00")
      );
      setFilteredJobs(filer);
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
          color: "#38373D",
          marginBottom: 1,
          fontWeight: "medium",
          marginLeft: 1,
        }}
      >
        Długo przetwarzające się procesy
      </Typography>
      <DataGrid
        style={{ height: "54vh", minHeight: 360, backgroundColor: "white" }}
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
