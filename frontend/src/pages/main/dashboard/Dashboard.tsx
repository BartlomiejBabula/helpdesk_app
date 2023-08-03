import { Routes, Route } from "react-router-dom";
import ShopListPage from "../storeListPage/ShopListPage";
import MonitPage from "../monitPage/MonitPage";
import HomePage from "../homePage/HomePage";
import { Card, Box, Container, Divider } from "@mui/material";
import { LeftMenu } from "./leftMenuComponent";

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
        <Divider orientation='vertical' />
        <Box sx={{ width: "100%", height: "100%" }}>
          <Routes>
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
