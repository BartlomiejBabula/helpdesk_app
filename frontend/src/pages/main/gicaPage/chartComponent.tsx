import { Button, Typography, Paper } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  formatDate,
  valueFormatter,
} from "../../../function/formatingDataFunction";
import { ChartGicaType } from "../../../redux/types";

interface ChartComponentType {
  GICA: any;
  setSelectedData: React.SetStateAction<any>;
}

const ChartComponent = ({ GICA, setSelectedData }: ChartComponentType) => {
  const handleGenerateGicaRaport = () => {
    let downloadData = [
      "Dzien;Odbior danych z GICA start;Odbior danych z GICA end;Sklepy sieciowe i franczyzowe start;Sklepy sieciowe i franczyzowe end;Hipermarkety start;Hipermarkety end;",
    ];
    GICA.days.forEach((day: ChartGicaType) => {
      const returnData = `${day.date};${
        day.ReceiveStart ? formatDate(day.ReceiveStart) : 0
      };${day.ReceiveEnd ? formatDate(day.ReceiveEnd) : 0};${
        day.NetworkStoreStart ? formatDate(day.NetworkStoreStart) : 0
      };${day.NetworkStoreEnd ? formatDate(day.NetworkStoreEnd) : 0};${
        day.HypermarketStart ? formatDate(day.HypermarketStart) : 0
      };${day.HypermarketEnd ? formatDate(day.HypermarketEnd) : 0}`;
      downloadData.push(returnData);
    });
    const element = document.createElement("a");
    const file = new Blob([downloadData.join("\n")], {
      type: "text/plain",
      endings: "native",
    });
    element.href = URL.createObjectURL(file);
    element.download = "GICA.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <Paper
      variant='outlined'
      sx={{
        height: 430,
        marginTop: 2,
        padding: 1,
        paddingLeft: 2,
        position: "relative",
      }}
    >
      <Button
        onClick={handleGenerateGicaRaport}
        sx={{ position: "absolute", top: 4, right: 20, zIndex: 1 }}
      >
        Pobierz dane za cały miesiąc
      </Button>
      <Typography
        variant='subtitle1'
        sx={{
          letterSpacing: 1,
          color: "#38373D",
          marginBottom: 6,
          fontWeight: "medium",
        }}
      >
        Analiza za ostatnie 30 dni
      </Typography>
      {GICA.days.length > 0 && (
        <BarChart
          onAxisClick={(event, item) => {
            let data = GICA.days.filter(
              (i: ChartGicaType) => i.date === item?.axisValue
            );
            setSelectedData(data[0]);
          }}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "date",
            },
          ]}
          series={[
            {
              dataKey: "ReceiveTimeInMinutes",
              label: "Odbiór danych",
              id: "ReceiveTimeInMinutes",
              valueFormatter,
              color: "#bab0ab",
            },
            {
              dataKey: "NetworkStoreTimeInMinutes",
              label: "Sklepy sieciowe i franczyzowe",
              id: "NetworkStoreTimeInMinutes",
              valueFormatter,
              color: "#4e9aaf",
            },
            {
              dataKey: "HypermarketTimeInMinutes",
              label: "Sklepy hipermarkety",
              id: "HypermarketTimeInMinutes",
              valueFormatter,
              color: "#f28e2c",
            },
          ]}
          dataset={GICA.days}
          yAxis={[{ label: "minuty (min)" }]}
          height={320}
          slotProps={{
            legend: {
              padding: -25,
              itemGap: 55,
            },
          }}
        />
      )}
    </Paper>
  );
};

export default ChartComponent;
