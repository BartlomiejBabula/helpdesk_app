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
  const [tab, setTab] = useState("dashboard");
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
      case "dashboard":
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
        margin: 1,
        padding: 2,
        backgroundImage: "linear-gradient(to bottom right, #36353b, #38373D)",
        width: 220,
        minWidth: 220,
        color: "#ccc",
        textAlign: "center",
        borderRadius: 1.5,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant='subtitle2' sx={{ letterSpacing: 4, color: "white" }}>
        HELPDESK
      </Typography>
      <Typography
        variant='h4'
        sx={{
          letterSpacing: 2,
          fontWeight: "bold",
          marginBottom: 3,
          color: "white",
        }}
      >
        ESAMBO
      </Typography>
      <List
        disablePadding
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <ListItem
          disablePadding
          sx={{
            backgroundImage:
              window.location.pathname === "/dashboard/"
                ? "linear-gradient(to bottom right, #4fa8e0, #457b9d)"
                : "none",
            borderRadius: 1,
            color:
              window.location.pathname === "/dashboard/" ? "white" : "#ccc",
          }}
        >
          <ListItemButton
            onClick={() => {
              changeTab("dashboard");
              setTab("dashboard");
            }}
          >
            <ListItemIcon>
              <HomeIcon
                sx={{
                  fontSize: 20,
                }}
              />
            </ListItemIcon>
            <ListItemText primary='Strona głowna' />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            backgroundImage:
              window.location.pathname === "/dashboard/monit"
                ? "linear-gradient(to bottom right, #4fa8e0, #457b9d)"
                : "none",
            borderRadius: 1,
            color:
              window.location.pathname === "/dashboard/monit"
                ? "white"
                : "#ccc",
          }}
        >
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
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            backgroundImage:
              window.location.pathname === "/dashboard/jira"
                ? "linear-gradient(to bottom right, #4fa8e0, #457b9d)"
                : "none",
            borderRadius: 1,
            color:
              window.location.pathname === "/dashboard/jira" ? "white" : "#ccc",
          }}
        >
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
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            backgroundImage:
              window.location.pathname === "/dashboard/shoplist"
                ? "linear-gradient(to bottom right, #4fa8e0, #457b9d)"
                : "none",
            borderRadius: 1,
            color:
              window.location.pathname === "/dashboard/shoplist"
                ? "white"
                : "#ccc",
          }}
        >
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
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            backgroundImage:
              window.location.pathname === "/dashboard/redirection"
                ? "linear-gradient(to bottom right, #4fa8e0, #457b9d)"
                : "none",
            borderRadius: 1,
            color:
              window.location.pathname === "/dashboard/redirection"
                ? "white"
                : "#ccc",
          }}
        >
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
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            position: "absolute",
            bottom: 0,
            backgroundImage:
              "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
            borderRadius: 1,
            color: "white",
          }}
        >
          <ListItemButton onClick={handleLogout} sx={{ paddingLeft: 5 }}>
            <ListItemIcon>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary='Wyloguj' />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};
