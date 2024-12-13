import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { formatDateWithoutHours } from "../../../function/formatingDataFunction";
import { useSelector } from "react-redux";
import { gicaSelector } from "../../../redux/gica/GicaSlice";
import { ApiGicaType, ChartGicaType } from "../../../redux/types";
import ChartComponent from "./chartComponent";
import TableComponent from "./tableComponent";

interface GicaType {
  averagedReceiveTimeInMinutes: number;
  averagedNetworkStoreTimeInMinutes: number;
  averagedHypermarketTimeInMinutes: number;
  days: ChartGicaType[];
}

const GicaPage = () => {
  const [selectedData, setSelectedData] = useState<ChartGicaType>();
  const [GICA, setGICA] = useState<any>({
    averagedReceiveTimeInMinutes: 0,
    averagedNetworkStoreTimeInMinutes: 0,
    averagedHypermarketTimeInMinutes: 0,
    days: [],
  });
  let fetchedGicaData = useSelector(gicaSelector);

  function formatChartData(gicaApi: ApiGicaType[]) {
    let newGICA: GicaType = {
      averagedReceiveTimeInMinutes: 0,
      averagedHypermarketTimeInMinutes: 0,
      averagedNetworkStoreTimeInMinutes: 0,
      days: [],
    };

    let date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - 1);
    let monthAgo = new Date(date);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    while (monthAgo < date) {
      let newDate = monthAgo.setDate(monthAgo.getDate() + 1);
      monthAgo = new Date(newDate);
      let dayData: ChartGicaType = {
        date: formatDateWithoutHours(monthAgo),
        ReceiveTimeInMinutes: 0,
        HypermarketTimeInMinutes: 0,
        NetworkStoreTimeInMinutes: 0,
      };
      gicaApi.forEach((element: ApiGicaType) => {
        if (new Date(element.date).getTime() === newDate) {
          dayData = {
            ...element,
            date: formatDateWithoutHours(new Date(element.date)),
            ReceiveStart: new Date(element.ReceiveStart),
            ReceiveEnd: new Date(element.ReceiveEnd),
            NetworkStoreStart: new Date(element.NetworkStoreStart),
            NetworkStoreEnd: new Date(element.NetworkStoreEnd),
            HypermarketStart: new Date(element.HypermarketStart),
            HypermarketEnd: new Date(element.HypermarketEnd),
          };
          if (
            dayData.ReceiveTimeInMinutes &&
            dayData.HypermarketTimeInMinutes &&
            dayData.NetworkStoreTimeInMinutes
          ) {
            newGICA.averagedReceiveTimeInMinutes =
              newGICA.averagedReceiveTimeInMinutes +
              dayData.ReceiveTimeInMinutes;
            newGICA.averagedHypermarketTimeInMinutes =
              newGICA.averagedHypermarketTimeInMinutes +
              dayData.HypermarketTimeInMinutes;
            newGICA.averagedNetworkStoreTimeInMinutes =
              newGICA.averagedNetworkStoreTimeInMinutes +
              dayData.NetworkStoreTimeInMinutes;
          }
        }
      });

      newGICA.days.push(dayData);
    }
    newGICA.averagedReceiveTimeInMinutes = parseFloat(
      (newGICA.averagedReceiveTimeInMinutes / gicaApi.length).toFixed(2)
    );
    newGICA.averagedHypermarketTimeInMinutes = parseFloat(
      (newGICA.averagedHypermarketTimeInMinutes / gicaApi.length).toFixed(2)
    );
    newGICA.averagedNetworkStoreTimeInMinutes = parseFloat(
      (newGICA.averagedNetworkStoreTimeInMinutes / gicaApi.length).toFixed(2)
    );
    return newGICA;
  }

  useEffect(() => {
    if (fetchedGicaData.status === "succeeded") {
      let newGICA = formatChartData(fetchedGicaData.gica);
      setGICA(newGICA);
      if (selectedData === undefined) {
        setSelectedData(newGICA.days[newGICA.days.length - 1]);
      }
    }
  }, [fetchedGicaData, selectedData]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        paddingTop: 2,
      }}
    >
      <Typography
        variant='h6'
        sx={{
          letterSpacing: 2,
          color: "text.primary",
          marginLeft: 1,
          marginBottom: 1,
        }}
      >
        GICA
      </Typography>
      <TableComponent GICA={GICA} selectedData={selectedData} />
      <ChartComponent GICA={GICA} setSelectedData={setSelectedData} />
    </Box>
  );
};

export default GicaPage;
