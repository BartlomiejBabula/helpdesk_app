import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
} from "@mui/material";
import { editJira } from "../../../actions/UserActions";
import { Dispatcher, useAppDispatch } from "../../../store/AppStore";
import { useSelector } from "react-redux";
import { selectJira } from "../../../selectors/user";
import { JiraTypes } from "../../../types";

const JiraPage = () => {
  const dispatch: Dispatcher = useAppDispatch();
  let jira = useSelector(selectJira);
  const [checked, setChecked] = useState(false);
  const [input, setInput] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (jira) {
      setChecked(jira.auto);
      setInput(jira.jiraKey);
    }
  }, [jira]);

  const handleSubmit = () => {
    let newJira: JiraTypes = {
      auto: checked,
      jiraKey: input.replace(/\s/g, ""),
    };
    dispatch(editJira(newJira));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        padding: 2,
        paddingLeft: 6,
        marginBottom: 5,
      }}
    >
      <Typography
        variant='h6'
        sx={{
          letterSpacing: 2,
          color: "rgba(0, 0, 0, 0.6)",
          marginBottom: 5,
        }}
      >
        JIRA Automat
      </Typography>

      <Typography variant='subtitle1' sx={{ marginBottom: 2 }}>
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
        sx={{ width: 260, marginTop: 1 }}
      />
      {checked && (
        <Typography
          variant='subtitle2'
          sx={{ marginBottom: 2, color: "red", maxWidth: 600 }}
        >
          Uwaga! - ustawienie parametru uruchamia automatyczną rejestracje
          zgłoszeń z Carrefour, pod wskazanym nadrzędnym zadaniem - Hosting i
          utrzymanie sklepów za dany miesiąc
        </Typography>
      )}
      <Button
        sx={{
          letterSpacing: 2,
          height: 42,
          width: 200,
          marginBottom: 4,
          backgroundImage: "linear-gradient(to bottom right, #4fa8e0, #457b9d)",
        }}
        disabled={
          jira
            ? jira.jiraKey === input.replace(/\s/g, "") && jira.auto === checked
            : false
        }
        onClick={handleSubmit}
        variant='contained'
      >
        Zmień
      </Button>
    </Box>
  );
};

export default JiraPage;
