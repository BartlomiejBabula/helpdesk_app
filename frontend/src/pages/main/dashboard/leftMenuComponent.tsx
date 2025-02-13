import MonitIcon from "@mui/icons-material/MonitorHeart";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import LoggerIcon from "@mui/icons-material/LibraryBooks";
import HomeIcon from "@mui/icons-material/Home";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import ChartIcon from "@mui/icons-material/BarChart";
import AccountIcon from "@mui/icons-material/AccountBox";
import ScheduleIcon from "@mui/icons-material/Schedule";
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
import { logOut } from "../../../redux/user/UserSlice";
import { useState } from "react";
import { useAppDispatch } from "../../../redux/AppStore";
import { AppURL } from "../../../api/api";
import axios from "axios";

interface Values {
  tab: string;
}

export const LeftMenu = () => {
  const [tab, setTab] = useState("dashboard");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    axios.get(`${AppURL}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${localStorage.refresh}`,
      },
    });
    dispatch(logOut());
    localStorage.removeItem("refresh");
    localStorage.removeItem("access");
    navigate({ pathname: "/" }, { replace: true });
  };

  const changeTab = (tab: Values["tab"]) => {
    switch (tab) {
      case "procesy":
        navigate({ pathname: "./jobs" });
        break;
      case "shopList":
        navigate({ pathname: "./shoplist" });
        break;
      case "dashboard":
        navigate({ pathname: "./" });
        break;
      case "redirection":
        navigate({ pathname: "./redirection" });
        break;
      case "gica":
        navigate({ pathname: "./gica" });
        break;
      case "account":
        navigate({ pathname: "./account" });
        break;
      case "schedule":
        navigate({ pathname: "./schedule" });
        break;
      case "logger":
        navigate({ pathname: "./logger" });
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
      <Typography variant="subtitle2" sx={{ letterSpacing: 4, color: "white" }}>
        HELPDESK
      </Typography>
      <Typography
        variant="h4"
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
            bgcolor:
              window.location.pathname === "/dashboard/"
                ? "secondary.main"
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
            <ListItemText primary="Strona głowna" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            bgcolor:
              window.location.pathname === "/dashboard/jobs"
                ? "secondary.main"
                : "none",
            borderRadius: 1,
            color:
              window.location.pathname === "/dashboard/jobs" ? "white" : "#ccc",
          }}
        >
          <ListItemButton
            onClick={() => {
              changeTab("procesy");
              setTab("procesy");
            }}
          >
            <ListItemIcon>
              <MonitIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Procesy" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            bgcolor:
              window.location.pathname === "/dashboard/gica"
                ? "secondary.main"
                : "none",
            borderRadius: 1,
            color:
              window.location.pathname === "/dashboard/gica" ? "white" : "#ccc",
          }}
        >
          <ListItemButton
            onClick={() => {
              changeTab("gica");
              setTab("gica");
            }}
          >
            <ListItemIcon>
              <ChartIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="GICA" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            bgcolor:
              window.location.pathname === "/dashboard/schedule"
                ? "secondary.main"
                : "none",
            borderRadius: 1,
            color:
              window.location.pathname === "/dashboard/schedule"
                ? "white"
                : "#ccc",
          }}
        >
          <ListItemButton
            onClick={() => {
              changeTab("schedule");
              setTab("schedule");
            }}
          >
            <ListItemIcon>
              <ScheduleIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Harmonogramy" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            bgcolor:
              window.location.pathname === "/dashboard/logger"
                ? "secondary.main"
                : "none",
            borderRadius: 1,
            color:
              window.location.pathname === "/dashboard/logger"
                ? "white"
                : "#ccc",
          }}
        >
          <ListItemButton
            onClick={() => {
              changeTab("logger");
              setTab("logger");
            }}
          >
            <ListItemIcon>
              <LoggerIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Logger" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            bgcolor:
              window.location.pathname === "/dashboard/shoplist"
                ? "secondary.main"
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
            <ListItemText primary="Lista sklepów" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            bgcolor:
              window.location.pathname === "/dashboard/redirection"
                ? "secondary.main"
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
            <ListItemText primary="Serwisy" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            bgcolor:
              window.location.pathname === "/dashboard/account"
                ? "secondary.main"
                : "none",
            borderRadius: 1,
            color:
              window.location.pathname === "/dashboard/account"
                ? "white"
                : "#ccc",
          }}
        >
          <ListItemButton
            onClick={() => {
              changeTab("account");
              setTab("account");
            }}
          >
            <ListItemIcon>
              <AccountIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Konto" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            position: "absolute",
            bottom: 0,
            bgcolor: "secondary.main",
            borderRadius: 1,
            color: "white",
          }}
        >
          <ListItemButton onClick={handleLogout} sx={{ paddingLeft: 5 }}>
            <ListItemIcon>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Wyloguj" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};
