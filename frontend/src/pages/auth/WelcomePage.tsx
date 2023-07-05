import { Routes, Route } from "react-router-dom";
import { LoginComponent } from "./login";
import { RegisterComponent } from "./register";
import { Card, Box, Container, Typography } from "@mui/material";

const WelcomePage = () => {
  return (
    <Container
      fixed
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "10vh",
      }}
    >
      <Card
        sx={{
          width: "75%",
          minWidth: 800,
          height: "50vh",
          minHeight: 450,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "14%",
            // backgroundImage:"linear-gradient(to bottom right, #42a5f5, #1976d2)",
            backgroundColor: "primary.main",
            width: "45%",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant='h6' sx={{ letterSpacing: 4, marginBottom: 2 }}>
            ESAMBO
          </Typography>
          <Typography
            variant='h3'
            sx={{ letterSpacing: 6, fontWeight: "medium" }}
          >
            HELPDESK
          </Typography>
          <Typography
            variant='body1'
            sx={{
              fontWeight: "medium",
              letterSpacing: 3,
              marginTop: 4,
              paddingX: 3,
            }}
          >
            Siemanko, tu znajdziesz wszystko co potrzeba do sprawnej pracy
          </Typography>
        </Box>
        <Routes>
          <Route path='/' element={<LoginComponent />} />
          <Route path='/register' element={<RegisterComponent />} />
        </Routes>
      </Card>
    </Container>
  );
};

export default WelcomePage;
