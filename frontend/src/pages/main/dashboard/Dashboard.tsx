import { Routes, Route } from "react-router-dom";
import ShopListPage from "../storeListPage/ShopListPage";
import MonitPage from "../monitPage/MonitPage";
import HomePage from "../homePage/HomePage";
import { Card, Box, Container } from "@mui/material";
import { LeftMenu } from "./leftMenuComponent";
import JiraPage from "../jiraPage/jiraPage";
import RedirectionPage from "../redirectionPage/RedirectionPage";

const Dashboard = () => {
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
