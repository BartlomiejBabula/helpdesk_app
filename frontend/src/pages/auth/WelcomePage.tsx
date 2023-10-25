import { Routes, Route } from "react-router-dom";
import { LoginComponent } from "./login";
import { RegisterComponent } from "./register";
import { Card, CardMedia, Container, Typography } from "@mui/material";

const WelcomePage = () => {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Card
        sx={{
          mt: 10,
          height: 550,
          display: "flex",
          flexDirection: "column",
          width: 450,
          alignItems: "center",
        }}
      >
        <CardMedia
          component='img'
          image='/logo_lefttop.jpg'
          alt='logo'
          sx={{ width: 200, mt: 2 }}
        />
        <Typography
          variant='h6'
          sx={{ letterSpacing: 4, color: "rgba(0, 0, 0, 0.6)", mt: 1 }}
        >
          HELPDESK
        </Typography>
        <Routes>
          <Route path='/' element={<LoginComponent />} />
          <Route path='/register' element={<RegisterComponent />} />
        </Routes>
      </Card>
    </Container>
  );
};

export default WelcomePage;
