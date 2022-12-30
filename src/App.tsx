import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "./styles/Theme";
import CssBaseline from "@mui/material/CssBaseline";
import WelcomePage from "./pages/WelcomePage";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <BrowserRouter>
        <CssBaseline />
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "#f7faff",
            height: "100%",
            width: "100%",
            zIndex: "-1",
          }}
        />
        <Routes>
          <Route path='/*' element={<WelcomePage />} />
          <Route path='/dashboard/*' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
