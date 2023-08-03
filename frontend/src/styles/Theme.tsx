import { createTheme, alpha, getContrastRatio } from "@mui/material/styles";

const mainBlueBase = "#457b9d";
const blueMain = alpha(mainBlueBase, 1);

export const appTheme = createTheme({
  palette: {
    primary: {
      main: blueMain,
      light: alpha(mainBlueBase, 0.7),
      contrastText:
        getContrastRatio(mainBlueBase, "#fff") > 4.5 ? "#fff" : "#111",
    },
    secondary: {
      main: "rgba(230, 57, 70, 1)",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          height: 70,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "white",
          minWidth: 0,
          marginRight: 16,
        },
      },
    },
    MuiListItemText: {
      defaultProps: {
        primaryTypographyProps: {
          variant: "subtitle2",
          fontWeight: "normal",
          letterSpacing: 0.5,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingTop: 6,
          paddingBottom: 6,
        },
      },
    },
  },
});

// /* SCSS RGB */
// $imperial-red: rgba(230, 57, 70, 1);
// $honeydew: rgba(241, 250, 238, 1);
// $powder-blue: rgba(168, 218, 220, 1);
// $celadon-blue: rgba(69, 123, 157, 1);
// $prussian-blue: rgba(29, 53, 87, 1);

// /* SCSS Gradient */
// $gradient-top: linear-gradient(0deg, #e63946ff, #f1faeeff, #a8dadcff, #457b9dff, #1d3557ff);
// $gradient-right: linear-gradient(90deg, #e63946ff, #f1faeeff, #a8dadcff, #457b9dff, #1d3557ff);
// $gradient-bottom: linear-gradient(180deg, #e63946ff, #f1faeeff, #a8dadcff, #457b9dff, #1d3557ff);
// $gradient-left: linear-gradient(270deg, #e63946ff, #f1faeeff, #a8dadcff, #457b9dff, #1d3557ff);
// $gradient-top-right: linear-gradient(45deg, #e63946ff, #f1faeeff, #a8dadcff, #457b9dff, #1d3557ff);
// $gradient-bottom-right: linear-gradient(135deg, #e63946ff, #f1faeeff, #a8dadcff, #457b9dff, #1d3557ff);
// $gradient-top-left: linear-gradient(225deg, #e63946ff, #f1faeeff, #a8dadcff, #457b9dff, #1d3557ff);
// $gradient-bottom-left: linear-gradient(315deg, #e63946ff, #f1faeeff, #a8dadcff, #457b9dff, #1d3557ff);
// $gradient-radial: radial-gradient(#e63946ff, #f1faeeff, #a8dadcff, #457b9dff, #1d3557ff);
