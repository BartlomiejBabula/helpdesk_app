import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { selectReplication } from "../../../selectors/user";
import { ReplicationTypes } from "../../../types";
import { useAppSelector } from "../../../store/AppStore";

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

export const ReplicationComponent = () => {
  let replication: ReplicationTypes[] = useAppSelector(selectReplication);
  return (
    <DataGrid
      getRowId={(row) => row.ID}
      sx={{ height: 110 }}
      rows={replication ? replication : []}
      columns={columnsReplication}
      hideFooter
      disableColumnMenu={true}
      density={"compact"}
    />
  );
};
