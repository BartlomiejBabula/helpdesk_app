import { useState, useEffect } from "react";
import Alert, { AlertProps } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import FormattedTable from "./FormattedTable";
import { formatDate } from "../function/formatingDataFunction";
import { useAppDispatch, useAppSelector } from "../redux/AppStore";
import {
  shownSnackbarZabbix,
  zabbixSelector,
} from "../redux/zabbix/ZabbixSlice";
import { ApiZabbixType } from "../redux/types";

function severityName(i: number) {
  switch (i) {
    case 0:
      return "Not classified";
    case 1:
      return "Information";
    case 2:
      return "Warning";
    case 3:
      return "Average";
    case 4:
      return "High";
    case 5:
      return "Disaster";
    default:
      break;
  }
}

const SnackbarZabbix = () => {
  const dispatch = useAppDispatch();
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const problemList = useAppSelector(zabbixSelector);

  useEffect(() => {
    setSnackbar({
      children: "",
      severity: "error",
    });
  }, []);

  useEffect(() => {
    let fetchData: any[] = [];
    problemList.forEach((problem: ApiZabbixType) => {
      if (problem.recoveryEventId === 0) {
        fetchData.push([
          problem.host,
          severityName(problem.severity),
          formatDate(new Date(problem.clock)),
          problem.name,
        ]);
      }
    });
    setTableData(fetchData);
  }, [problemList]);

  const handleCloseSnackbar = () => {
    dispatch(shownSnackbarZabbix());
    setSnackbar(null);
  };

  return (
    <Snackbar open anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert
        variant="outlined"
        severity="error"
        onClose={handleCloseSnackbar}
        sx={{
          backgroundColor: "background.paper",
          width: "68vw",
          minWidth: 600,
        }}
      >
        <AlertTitle
          sx={{
            letterSpacing: 1,
            color: "text.primary",
            marginBottom: 5,
            fontWeight: "medium",
          }}
        >
          ZABBIX
        </AlertTitle>
        <FormattedTable
          style={{ mb: 5 }}
          dataArray={tableData.reverse()}
          titleColumnsArray={["Serwer", "Powaga", "Czas wystąpienia", "Opis"]}
          widthColumnsArray={[200, 100, 170, 500]}
        />
      </Alert>
    </Snackbar>
  );
};

export default SnackbarZabbix;
