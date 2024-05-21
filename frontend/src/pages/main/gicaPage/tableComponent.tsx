import { Box, Typography, Paper } from "@mui/material";
import {
  formatDate,
  valueFormatter,
} from "../../../function/formatingDataFunction";
import FormattedTable from "../../../components/FormattedTable";
import { ChartGicaType } from "../../../redux/types";

interface GicaType {
  averagedReceiveTimeInMinutes: number;
  averagedNetworkStoreTimeInMinutes: number;
  averagedHypermarketTimeInMinutes: number;
  days: ChartGicaType[];
}

interface TableComponentType {
  selectedData: ChartGicaType | undefined;
  GICA: GicaType;
}

const TableComponent = ({ selectedData, GICA }: TableComponentType) => {
  return (
    <Box
      sx={{
        height: 200,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Paper
        variant='outlined'
        sx={{
          width: "60%",
          padding: 1,
          paddingLeft: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant='subtitle1'
          sx={{
            letterSpacing: 1,
            color: "#38373D",
            marginBottom: 3,
            fontWeight: "medium",
          }}
        >
          Przebieg procesu GICA za {selectedData && selectedData.date}
        </Typography>
        <FormattedTable
          titleColumnsArray={["Proces", "Start", "Zakończenie"]}
          dataArray={[
            [
              "Odbiór danych z GICA",
              selectedData?.ReceiveStart
                ? formatDate(selectedData.ReceiveStart)
                : 0,
              selectedData?.ReceiveEnd
                ? formatDate(selectedData?.ReceiveEnd)
                : 0,
            ],
            [
              "Sklepy sieciowe",
              selectedData?.NetworkStoreStart
                ? formatDate(selectedData.NetworkStoreStart)
                : 0,
              selectedData?.NetworkStoreEnd
                ? formatDate(selectedData?.NetworkStoreEnd)
                : 0,
            ],
            [
              "Sklepy hipermarket",
              selectedData?.HypermarketStart
                ? formatDate(selectedData.HypermarketStart)
                : 0,
              selectedData?.HypermarketEnd
                ? formatDate(selectedData?.HypermarketEnd)
                : 0,
            ],
          ]}
          widthColumnsArray={[250, 200, "30%"]}
        />
      </Paper>
      <Paper
        variant='outlined'
        sx={{
          marginLeft: 2,
          width: "45%",
          padding: 1,
          paddingLeft: 2,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Typography
          variant='subtitle1'
          sx={{
            letterSpacing: 1,
            color: "#38373D",
            marginBottom: 3,
            fontWeight: "medium",
          }}
        >
          Uśrednione dane za 30 dni
        </Typography>
        <FormattedTable
          titleColumnsArray={["Proces", "Czas trwania"]}
          dataArray={[
            [
              "Średni czas odbioru danych z GICA",
              valueFormatter(
                GICA.averagedReceiveTimeInMinutes
                  ? GICA.averagedReceiveTimeInMinutes
                  : 0
              ),
            ],
            [
              "Średni czas aktualizacji na sklepach sieciowych",
              valueFormatter(
                GICA.averagedNetworkStoreTimeInMinutes
                  ? GICA.averagedNetworkStoreTimeInMinutes
                  : 0
              ),
            ],
            [
              "Średni czas aktualizacji na hipermarketach",
              valueFormatter(
                GICA.averagedHypermarketTimeInMinutes
                  ? GICA.averagedHypermarketTimeInMinutes
                  : 0
              ),
            ],
          ]}
          widthColumnsArray={["75%", 80]}
        />
      </Paper>
    </Box>
  );
};

export default TableComponent;
