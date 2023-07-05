import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { selectReplication } from "../../../selectors/user";
import { useSelector } from "react-redux";

const columnsReplication: GridColDef[] = [
  {
    field: "SYSDATE",
    headerName: "Aktualna godzina",
    width: 220,
  },
  {
    field: "DANE_ZREPLIKOWANE",
    headerName: "Zreplikowana godzina",
    width: 220,
  },
  {
    field: "A",
    headerName: "Ilość godzin opóźnienia",
    width: 220,
  },
];

export const ReplicationComponent = () => {
  let replication: any = useSelector<any>(selectReplication);
  return (
    <DataGrid
      getRowId={(row) => row.SYSDATE}
      sx={{ height: 110 }}
      rows={replication ? replication : []}
      columns={columnsReplication}
      hideFooter
      disableColumnMenu={true}
      density={"compact"}
    />
  );
};
