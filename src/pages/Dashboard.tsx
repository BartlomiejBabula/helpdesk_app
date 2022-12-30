import MonitIcon from "@mui/icons-material/MonitorHeart";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import ShopListPage from "./ShopListPage";
import MonitPage from "./MonitPage";
import HomePage from "./HomePage";
import {
  Card,
  Box,
  Container,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";

interface Values {
  tab: string;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate({ pathname: "/" });
  };

  const changeTab = (tab: Values["tab"]) => {
    switch (tab) {
      case "monitoring":
        navigate({ pathname: "./monit" });
        break;
      case "shopList":
        navigate({ pathname: "./shoplist" });
        break;
      case "services":
        navigate({ pathname: "./external-services" });
        break;
      default:
        break;
    }
  };

  return (
    <Container
      maxWidth='xl'
      sx={{
        minHeight: 850,
        minWidth: 1200,
        marginTop: 5,
      }}
    >
      <Card sx={{ height: 800, display: "flex" }}>
        <Box
          sx={{
            backgroundColor: "primary.main",
            width: 220,
            height: "100%",
            color: "white",
            textAlign: "center",
            paddingTop: 3,
          }}
        >
          <Typography variant='h6' sx={{ letterSpacing: 2 }}>
            HELPDESK
          </Typography>
          <Typography
            variant='h4'
            sx={{ letterSpacing: 6, fontWeight: "bold", marginBottom: 4 }}
          >
            ESAMBO
          </Typography>
          <Box sx={{ height: "100%", display: "flex" }}>
            <List sx={{ width: "100%" }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    changeTab("services");
                  }}
                >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary='HOME' />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    changeTab("monitoring");
                  }}
                >
                  <ListItemIcon>
                    <MonitIcon />
                  </ListItemIcon>
                  <ListItemText primary='MONITORING' />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    changeTab("shopList");
                  }}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary='LISTA SKLEPÓW' />
                </ListItemButton>
              </ListItem>
              <Box
                sx={{
                  display: "flex",
                  height: "67%",
                }}
              >
                <ListItem disablePadding sx={{ alignSelf: "flex-end" }}>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary='WYLOGUJ' />
                  </ListItemButton>
                </ListItem>
              </Box>
            </List>
          </Box>
        </Box>
        <Divider orientation='vertical' />
        <Box sx={{ width: "85%", height: "100%", padding: 0.5 }}>
          <Routes>
            <Route path='/shoplist' element={<ShopListPage />} />
            <Route path='/monit' element={<MonitPage />} />
            <Route path='/external-services' element={<HomePage />} />
          </Routes>
        </Box>
      </Card>
    </Container>
  );
};

export default Dashboard;
