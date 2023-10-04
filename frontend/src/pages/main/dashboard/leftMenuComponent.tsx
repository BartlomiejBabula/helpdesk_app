import MonitIcon from "@mui/icons-material/MonitorHeart";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import HomeIcon from "@mui/icons-material/Home";
import ShortcutIcon from "@mui/icons-material/Shortcut";
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
import { logOutAction } from "../../../actions/UserActions";
import api from "../../../api/api";
import { useState } from "react";
import { Dispatcher, useAppDispatch } from "../../../store/AppStore";

interface Values {
  tab: string;
}

export const LeftMenu = () => {
  const [tab, setTab] = useState("");
  const navigate = useNavigate();
  const dispatch: Dispatcher = useAppDispatch();

  const handleLogout = () => {
    const refreshToken = { refresh: localStorage.refresh };
    api.post("/logout", refreshToken);
    dispatch(logOutAction());
    localStorage.removeItem("refresh");
    localStorage.removeItem("access");
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
      case "jira":
        navigate({ pathname: "./jira" });
        break;
      case "redirection":
        navigate({ pathname: "./redirection" });
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
              onClick={() => {
                changeTab("services");
                setTab("services");
              }}
            >
              <ListItemIcon>
                <HomeIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Strona głowna' />
              <Box
                sx={{
                  display: tab === "services" ? null : "none",
                  alignSelf: "flex-end",
                  width: 0,
                  height: 0,
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderRight: "9px solid white",
                  marginBottom: "7px",
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                changeTab("monitoring");
                setTab("monitoring");
              }}
            >
              <ListItemIcon>
                <MonitIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Monitoring' />
              <Box
                sx={{
                  display: tab === "monitoring" ? null : "none",
                  alignSelf: "flex-end",
                  width: 0,
                  height: 0,
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderRight: "9px solid white",
                  marginBottom: "7px",
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                changeTab("jira");
                setTab("jira");
              }}
            >
              <ListItemIcon>
                <DriveFileRenameOutlineIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Automat JIRA' />
              <Box
                sx={{
                  display: tab === "jira" ? null : "none",
                  alignSelf: "flex-end",
                  width: 0,
                  height: 0,
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderRight: "9px solid white",
                  marginBottom: "7px",
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                changeTab("shopList");
                setTab("shopList");
              }}
            >
              <ListItemIcon>
                <ListIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Lista sklepów' />
              <Box
                sx={{
                  display: tab === "shopList" ? null : "none",
                  alignSelf: "flex-end",
                  width: 0,
                  height: 0,
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderRight: "9px solid white",
                  marginBottom: "7px",
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                changeTab("redirection");
                setTab("redirection");
              }}
            >
              <ListItemIcon>
                <ShortcutIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary='Serwisy' />
              <Box
                sx={{
                  display: tab === "redirection" ? null : "none",
                  alignSelf: "flex-end",
                  width: 0,
                  height: 0,
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderRight: "9px solid white",
                  marginBottom: "7px",
                }}
              />
            </ListItemButton>
          </ListItem>
          <Box
            sx={{
              display: "flex",
              height: "55%",
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
