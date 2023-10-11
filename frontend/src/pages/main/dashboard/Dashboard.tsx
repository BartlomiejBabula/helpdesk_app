import { Routes, Route } from "react-router-dom";
import ShopListPage from "../storeListPage/ShopListPage";
import MonitPage from "../monitPage/MonitPage";
import HomePage from "../homePage/HomePage";
import { Card, Box } from "@mui/material";
import { LeftMenu } from "./leftMenuComponent";
import JiraPage from "../jiraPage/jiraPage";
import RedirectionPage from "../redirectionPage/RedirectionPage";

const Dashboard = () => {
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
