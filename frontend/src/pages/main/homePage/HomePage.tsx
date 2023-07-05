import { useEffect } from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { getBlockRaport } from "../../../actions/UserActions";
import { Report } from "./reportComponent";
import { Selenium } from "./seleniumComponent";
import { ExternalServices } from "./redirectComponent";

const HomePage = () => {
  const dispatch = useDispatch<any>();

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
      }}
    >
      <Report />
      <Selenium />
      <ExternalServices />
    </Box>
  );
};

export default HomePage;
