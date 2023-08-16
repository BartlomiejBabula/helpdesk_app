import { useEffect } from "react";
import { Box } from "@mui/material";
import { getBlockRaport } from "../../../actions/UserActions";
import { Report } from "./reportComponent";
import { Selenium } from "./seleniumComponent";
import { ExternalServices } from "./redirectComponent";
import { Dispatcher, useAppDispatch } from "../../../store/AppStore";

const HomePage = () => {
  const dispatch: Dispatcher = useAppDispatch();

  useEffect(() => {
    dispatch(getBlockRaport());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getBlockRaport());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        padding: 2,
        paddingLeft: 5,
      }}
    >
      <Report />
      <Selenium />
      <ExternalServices />
    </Box>
  );
};

export default HomePage;
