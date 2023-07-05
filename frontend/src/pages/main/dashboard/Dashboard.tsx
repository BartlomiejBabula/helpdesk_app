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
        minWidth: 1200,
        marginTop: 2,
        marginBottom: 2,
      }}
    >
      <Card sx={{ height: 700, display: "flex" }}>
        <LeftMenu />
        <Divider orientation='vertical' />
        <Box sx={{ width: "85%", height: "100%", padding: 0.5 }}>
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
