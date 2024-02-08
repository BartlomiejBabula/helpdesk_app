import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/AppStore";
import { jiraSelector } from "../../../redux/jira/JiraSlice";
import { editJira } from "../../../redux/jira/editJira";

interface PostJiraType {
  jiraKey: string;
  auto: boolean;
}

const JiraPage = () => {
  const dispatch = useAppDispatch();
  let jira = useSelector(jiraSelector);
  const [checked, setChecked] = useState(false);
  const [input, setInput] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (jira.auto) {
      setChecked(jira.auto);
    }
    if (jira.jiraKey) {
      setInput(jira.jiraKey);
    }
  }, [jira]);

  const handleSubmit = () => {
    let newJira: PostJiraType = {
      auto: checked,
      jiraKey: input.replace(/\s/g, ""),
    };
    dispatch(editJira(newJira));
  };

  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        padding: 2,
        marginBottom: 5,
      }}
    >
      <Typography
        variant='h6'
        sx={{
          letterSpacing: 2,
          color: "#38373D",
          marginBottom: 1,
          marginLeft: 1,
        }}
      >
        Automat JIRA
      </Typography>
      <Paper
        variant='outlined'
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 3,
          width: 400,
        }}
      >
        <Typography
          variant='subtitle1'
          sx={{
            letterSpacing: 1,
            color: "#38373D",
            marginBottom: 2,
            fontWeight: "medium",
            marginLeft: 1,
          }}
        >
          Automatyczna rejestracja zgłoszeń
        </Typography>

        <FormControlLabel
          label={checked ? "Włączona" : "Wyłączona"}
          control={<Switch checked={checked} onChange={handleChange} />}
        />
        <TextField
          autoComplete='off'
          label='Nadrzędne zadanie hostingu np. ES-37288'
          size='small'
          id='storeNumber'
          name='storeNumber'
          type='text'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value);
          }}
          value={input}
          sx={{ width: "100%", marginTop: 3, alignSelf: "center" }}
        />
        <Typography variant='subtitle2' sx={{ color: "red" }}>
          Uwaga! - ustawienie parametru uruchamia automatyczną rejestracje
          zgłoszeń z Carrefour, pod wskazanym nadrzędnym zadaniem - Hosting i
          utrzymanie sklepów za dany miesiąc
        </Typography>
        <Button
          sx={{
            alignSelf: "center",
            letterSpacing: 2,
            height: 42,
            width: 200,
            marginTop: 5,
            marginBottom: 2,
            backgroundImage:
              "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
          }}
          disabled={
            jira
              ? jira.jiraKey === input.replace(/\s/g, "") &&
                jira.auto === checked
              : false
          }
          onClick={handleSubmit}
          variant='contained'
        >
          Zmień
        </Button>
      </Paper>
    </Box>
  );
};

export default JiraPage;
