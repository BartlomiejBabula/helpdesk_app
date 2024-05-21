import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "./styles/Theme";
import CssBaseline from "@mui/material/CssBaseline";
import WelcomePage from "./pages/auth/WelcomePage";
import Dashboard from "./pages/main/dashboard/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/AppStore";
import { userSelector } from "./redux/user/UserSlice";
import { getJobs } from "./redux/jobs/getJobs";
import { getJira } from "./redux/jira/getJira";
import { getUserProfile } from "./redux/user/getUserProfile";
import { getStoreList } from "./redux/stores/getStoreList";
import { getGica } from "./redux/gica/getGica";
import { getZabbix } from "./redux/zabbix/getZabbix";

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const refreshToken = localStorage.getItem("refresh");

  useEffect(() => {
    if (window.location.pathname !== "/" && refreshToken !== null) {
      dispatch(getUserProfile());
      dispatch(getGica());
      dispatch(getJira());
      dispatch(getJobs());
      dispatch(getStoreList());
      dispatch(getZabbix());
    }
    if (window.location.pathname !== "/" && refreshToken === null)
      window.location.replace("/");
  }, [dispatch]);

  return (
    <ThemeProvider theme={appTheme}>
      <BrowserRouter>
        <CssBaseline />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            minWidth: 1130,
            minHeight: 700,
            backgroundColor: "#f7faff",
          }}
        >
          <Routes>
            <Route path='/*' element={<WelcomePage />} />
            {user.isLogged && (
              <Route path='/dashboard/*' element={<Dashboard />} />
            )}
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
