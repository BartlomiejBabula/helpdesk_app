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
import { useState } from "react";

interface Values {
  tab: string;
}

export const LeftMenu = () => {
  const [tab, setTab] = useState("");
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
        minWidth: 190,
        height: "100%",
        color: "white",
        textAlign: "center",
        paddingTop: 3,
      }}
    >
      <Typography variant='subtitle2' sx={{ letterSpacing: 4 }}>
        HELPDESK
      </Typography>
      <Typography
        variant='h4'
        sx={{ letterSpacing: 2, fontWeight: "bold", marginBottom: 3 }}
      >
        ESAMBO
      </Typography>
      <Box sx={{ height: "100%", display: "flex" }}>
        <List sx={{ width: "100%" }}>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                backgroundColor:
                  tab === "services" ? "rgba(64, 152, 207,  0.7)" : null,
              }}
              onClick={() => {
                changeTab("services");
                setTab("services");
              }}
            >
              <ListItemIcon>
                <HomeIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Home' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                backgroundColor:
                  tab === "monitoring" ? "rgba(64, 152, 207,  0.7)" : null,
              }}
              onClick={() => {
                changeTab("monitoring");
                setTab("monitoring");
              }}
            >
              <ListItemIcon>
                <MonitIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Monitoring' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                backgroundColor:
                  tab === "shopList" ? "rgba(64, 152, 207,  0.7)" : null,
              }}
              onClick={() => {
                changeTab("shopList");
                setTab("shopList");
              }}
            >
              <ListItemIcon>
                <ListIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Lista sklepów' />
            </ListItemButton>
          </ListItem>
          <Box
            sx={{
              display: "flex",
              height: "68%",
            }}
          >
            <ListItem disablePadding sx={{ alignSelf: "flex-end" }}>
              <ListItemButton onClick={handleLogout} sx={{ paddingLeft: 5 }}>
                <ListItemIcon>
                  <LogoutIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary='Wyloguj' />
              </ListItemButton>
            </ListItem>
          </Box>
        </List>
      </Box>
    </Box>
  );
};
