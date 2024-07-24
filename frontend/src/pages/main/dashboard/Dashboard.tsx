import { Routes, Route } from "react-router-dom";
import ShopListPage from "../storeListPage/ShopListPage";
import JobsPage from "../jobPage/JobsPage";
import HomePage from "../homePage/HomePage";
import { Card, Box } from "@mui/material";
import { LeftMenu } from "./leftMenuComponent";
import JiraPage from "../jiraPage/JiraPage";
import GicaPage from "../gicaPage/GicaPage";
import RedirectionPage from "../redirectionPage/RedirectionPage";
import { useEffect } from "react";
import api, { destroyToken, saveToken, setAuthHeader } from "../../../api/api";
import { useAppDispatch, useAppSelector } from "../../../redux/AppStore";
import { getJobs } from "../../../redux/jobs/getJobs";
import { getBlockedReports } from "../../../redux/reports/getBlockedReports";
import { getStoreList } from "../../../redux/stores/getStoreList";
import SnackbarZabbix from "../../../components/SnackbarZabbix";
import { getZabbix } from "../../../redux/zabbix/getZabbix";
import { zabbixSelectorShowed } from "../../../redux/zabbix/ZabbixSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const zabbixSnackbarActive = useAppSelector(zabbixSelectorShowed);

  useEffect(() => {
    const interval = setInterval(() => {
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken !== null && refreshToken !== undefined) {
        setAuthHeader(refreshToken);
        api
          .get("/auth/refresh")
          .then((response) => {
            saveToken(response);
            setAuthHeader(response.data.accessToken);
            dispatch(getBlockedReports());
            dispatch(getJobs());
            dispatch(getStoreList());
            dispatch(getZabbix());
          })
          .catch((error) => {
            destroyToken();
            if (
              error.response.data === "Błędny refresh token - sesja wygasła"
            ) {
              window.location.replace("/");
            }
          });
      } else window.location.replace("/");
    }, 60000 * 2);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      sx={{
        display: "flex",
        height: "100%",
        backgroundColor: "#f7faff",
      }}
    >
      <LeftMenu />
      <Box sx={{ width: "100%" }}>
        <Routes>
          <Route path='/gica' element={<GicaPage />} />
          <Route path='/redirection' element={<RedirectionPage />} />
          <Route path='/jira' element={<JiraPage />} />
          <Route path='/shoplist' element={<ShopListPage />} />
          <Route path='/jobs' element={<JobsPage />} />
          <Route path='/' element={<HomePage />} />
        </Routes>
        {!zabbixSnackbarActive && <SnackbarZabbix />}
      </Box>
    </Card>
  );
};

export default Dashboard;
