import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ShopListPage from "../storeListPage/ShopListPage";
import MonitPage from "../monitPage/MonitPage";
import HomePage from "../homePage/HomePage";
import { Card, Box, Container } from "@mui/material";
import { LeftMenu } from "./leftMenuComponent";
import JiraPage from "../jiraPage/jiraPage";
import RedirectionPage from "../redirectionPage/RedirectionPage";
import { Dispatcher, useAppDispatch } from "../../../store/AppStore";
import { logOutAction } from "../../../actions/UserActions";
import api from "../../../api/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch: Dispatcher = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("refresh") === null) {
      const refreshToken = { refresh: localStorage.refresh };
      dispatch(logOutAction());
      localStorage.removeItem("refresh");
      localStorage.removeItem("access");
      api.post("/logout", refreshToken);
      navigate({ pathname: "/" }, { replace: true });
    }
  }, [navigate, dispatch]);

  return (
    <Container
      maxWidth='xl'
      sx={{
        marginTop: 2,
        marginBottom: 2,
      }}
    >
      <Card sx={{ display: "flex", height: 700 }}>
        <LeftMenu />
        <Box sx={{ width: "100%", height: "100%" }}>
          <Routes>
            <Route path='/redirection' element={<RedirectionPage />} />
            <Route path='/jira' element={<JiraPage />} />
            <Route path='/shoplist' element={<ShopListPage />} />
            <Route path='/monit' element={<MonitPage />} />
            <Route path='/' element={<HomePage />} />
          </Routes>
        </Box>
      </Card>
    </Container>
  );
};

export default Dashboard;
