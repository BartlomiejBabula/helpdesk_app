import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    // primary: {
    //   main: "#A4EBF3",
    // },
    // secondary: {
    //   main: "#CCF2F4",
    // },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          height: 70,
        },
      },
    },
  },
});
