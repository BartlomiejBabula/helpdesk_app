import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "./styles/Theme";
import CssBaseline from "@mui/material/CssBaseline";
import WelcomePage from "./pages/WelcomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path='*' element={<WelcomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
