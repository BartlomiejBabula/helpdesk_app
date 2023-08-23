import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { selectJobs } from "../../../selectors/user";
import { JobTypes } from "../../../types";
import { useAppSelector } from "../../../store/AppStore";

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

export const JobsComponent = () => {
  let jobs: JobTypes[] = useAppSelector(selectJobs);
  return (
    <Box style={{ height: 580 }}>
      <DataGrid
        rows={jobs ? jobs : []}
        columns={columnsProcess}
        disableColumnMenu={true}
        initialState={{
          sorting: {
            sortModel: [{ field: "col4", sort: "asc" }],
          },
        }}
        density={"compact"}
      />
    </Box>
  );
};
