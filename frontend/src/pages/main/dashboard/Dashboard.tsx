import { Routes, Route } from "react-router-dom";
import ShopListPage from "../storeListPage/ShopListPage";
import MonitPage from "../monitPage/MonitPage";
import HomePage from "../homePage/HomePage";
import { Card, Box } from "@mui/material";
import { LeftMenu } from "./leftMenuComponent";
import JiraPage from "../jiraPage/jiraPage";
import RedirectionPage from "../redirectionPage/RedirectionPage";

import { useEffect } from "react";
import { getBlockRaport } from "../../../actions/UserActions";
import { Dispatcher, useAppDispatch } from "../../../store/AppStore";
import { getJobs } from "../../../actions/UserActions";
import api, { destroyToken, saveToken, setAuthHeader } from "../../../api/api";

const Dashboard = () => {
  const dispatch: Dispatcher = useAppDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      const refreshToken = localStorage.getItem("refresh");
      setAuthHeader(refreshToken);
      api
        .get("/refresh-token")
        .then((response) => {
          saveToken(response);
          setAuthHeader(response.data.token);
          dispatch(getBlockRaport());
          dispatch(getJobs());
        })
        .catch((error) => {
          destroyToken();
          if (error.response.data === "Błędny refresh token - sesja wygasła") {
            window.location.replace("/");
          }
        });
    }, 60000 * 2);
    return () => clearInterval(interval);
  }, [dispatch]);

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
          <Route path='/redirection' element={<RedirectionPage />} />
          <Route path='/jira' element={<JiraPage />} />
          <Route path='/shoplist' element={<ShopListPage />} />
          <Route path='/monit' element={<MonitPage />} />
          <Route path='/' element={<HomePage />} />
        </Routes>
      </Box>
    </Card>
  );
};

export default Dashboard;
