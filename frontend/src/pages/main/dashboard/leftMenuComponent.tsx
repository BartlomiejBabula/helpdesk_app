import MonitIcon from "@mui/icons-material/MonitorHeart";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { logOutAction } from "../../../actions/UserActions";
import api from "../../../api/api";

interface Values {
  tab: string;
}

export const LeftMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const handleLogout = () => {
    const refreshToken = { refresh: localStorage.refresh };
    dispatch(logOutAction());
    localStorage.removeItem("refresh");
    localStorage.removeItem("access");
    api.post("/logout", refreshToken);
    navigate({ pathname: "/" }, { replace: true });
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
        navigate({ pathname: "./" });
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(to bottom right, #4098cf, #457b9d)",
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
              height: "63%",
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
  );
};
