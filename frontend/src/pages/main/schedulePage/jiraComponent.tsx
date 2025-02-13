import { Typography, TextField, Paper } from "@mui/material";

const JiraComponent = ({ description, onChange }: any) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        marginTop: 2,
        marginLeft: 2,
        minWidth: 400,
        width: "45%",
        padding: 2,
      }}
    >
      <TextField
        autoComplete="off"
        label="Nadrzędne zadanie hostingu np. ES-37288"
        size="small"
        id="description"
        name="description"
        type="text"
        onChange={onChange}
        value={description}
        sx={{ width: "100%", marginTop: 3, alignSelf: "center" }}
      />
      <Typography variant="subtitle2" sx={{ color: "error.main" }}>
        Uwaga! - ustawienie parametru uruchamia automatyczną rejestracje
        zgłoszeń z Carrefour, pod wskazanym nadrzędnym zadaniem - Hosting i
        utrzymanie sklepów za dany miesiąc
      </Typography>
    </Paper>
  );
};

export default JiraComponent;
