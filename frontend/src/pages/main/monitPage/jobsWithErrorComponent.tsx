import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { selectJobs } from "../../../selectors/user";
import { useAppSelector } from "../../../store/AppStore";
import { JobTypes } from "../../../types";
import { formatDate, formatErrorMessage } from "../../../actions/UserActions";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { JobModal } from "../../../components/JobModal";

export const JobsWithErrorComponent = () => {
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
    {
      field: "ERROR_MESSAGE",
      headerName: "Error",
      width: 1200,
      renderCell: (params) => formatErrorMessage(params.row?.ERROR_MESSAGE),
    },
  ];

  useEffect(() => {
    if (jobs !== undefined) {
      let filer = jobs.filter((job: JobTypes) => job.ERROR_MESSAGE !== null);
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
      <JobModal
        row={selectedRow}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        selectedAction={selectedAction}
      />
    </Box>
  );
};
