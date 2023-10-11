import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "./styles/Theme";
import CssBaseline from "@mui/material/CssBaseline";
import WelcomePage from "./pages/auth/WelcomePage";
import Dashboard from "./pages/main/dashboard/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectUser } from "./selectors/user";
import { getUserProfile } from "./actions/UserActions";

const App = () => {
  const dispatch = useDispatch<any>();
  let user = useSelector(selectUser);

  useEffect(() => {
    if (window.location.pathname !== "/") {
      dispatch(getUserProfile());
    }
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
