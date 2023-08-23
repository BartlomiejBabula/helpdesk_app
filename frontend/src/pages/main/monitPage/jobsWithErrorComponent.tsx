import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { selectErrorJobs } from "../../../selectors/user";
import { useAppSelector } from "../../../store/AppStore";
import { JobTypes } from "../../../types";

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
  { field: "TM_START", headerName: "Start Procesu", width: 200 },
  { field: "ERROR_MESSAGE", headerName: "Error", width: 560 },
];

export const JobsWithErrorComponent = () => {
  let errorJobs: JobTypes[] = useAppSelector(selectErrorJobs);
  return (
    <Box style={{ height: 580 }}>
      <DataGrid
        rows={errorJobs ? errorJobs : []}
        columns={columnsProcess}
        disableColumnMenu={true}
        // pageSize={25}
        density={"compact"}
      />
    </Box>
  );
};
