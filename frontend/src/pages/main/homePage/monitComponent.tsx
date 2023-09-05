import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { selectJobs, selectReplication } from "../../../selectors/user";
import { JobTypes, ReplicationTypes } from "../../../types";
import { useAppSelector } from "../../../store/AppStore";
import { formatDate } from "../../../actions/UserActions";

const columnsProcess: GridColDef[] = [
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

export const Monitoring = () => {
  const [filteredJobs, setFilteredJobs] = useState<JobTypes[]>();
  let jobs: JobTypes[] = useAppSelector(selectJobs);
  let replication: ReplicationTypes[] = useAppSelector(selectReplication);

  useEffect(() => {
    if (jobs !== undefined) {
      let compareDate = new Date(Date.now() - 3600 * 1000 * 240); // current day -240 h / 10days
      let compareDate2 = new Date(Date.now() - 3600 * 1000 * 0.25);
      let filer = jobs.filter(
        (job: JobTypes) =>
          new Date(job.TM_CREATE) > compareDate &&
          new Date(job.TM_RESTART) < compareDate2
      );
      setFilteredJobs(filer);
    }
  }, [jobs]);

  return (
    <Box>
      <Typography
        variant='subtitle1'
        sx={{
          letterSpacing: 1,
          color: "rgba(0, 0, 0, 0.6)",
          marginBottom: 1,
          fontWeight: "medium",
          marginLeft: 1,
        }}
      >
        Długo przetwarzające się procesy
      </Typography>
      <DataGrid
        style={{ height: 290 }}
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
          color: "rgba(0, 0, 0, 0.6)",
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
    </Box>
  );
};
