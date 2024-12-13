import {
  Box,
  FormControlLabel,
  List,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/AppStore";
import { useSelector } from "react-redux";
import {
  userSelector,
  userSelectorStatus,
} from "../../../redux/user/UserSlice";
import { updateDarkTheme } from "../../../redux/user/updateDarkTheme";

const AccountPage = () => {
  const [checkedTheme, setCheckedTheme] = useState(false);
  const dispatch = useAppDispatch();
  let user = useSelector(userSelector);
  let status = useSelector(userSelectorStatus);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user.id !== undefined && status === "succeeded") {
      const theme = {
        id: user.id,
        darkTheme: event.target.checked,
      };
      await dispatch(updateDarkTheme(theme));
    }
  };

  useEffect(() => {
    if (user.darkTheme !== undefined && user.darkTheme !== null) {
      setCheckedTheme(user.darkTheme);
    }
  }, [user.darkTheme]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Box sx={{ marginBottom: 2 }}>
        <Typography
          variant="h6"
          sx={{
            letterSpacing: 2,
            color: "text.primary",
            marginLeft: 1,
          }}
        >
          Ustawienia konta
        </Typography>
      </Box>
      <Paper
        variant="outlined"
        sx={{
          padding: 2,
          width: "70%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            letterSpacing: 1,
            color: "text.primary",
            marginBottom: 2,
            fontWeight: "medium",
          }}
        >
          Konto
        </Typography>
        <List>
          <Stack direction="row" spacing={2} sx={{ marginBottom: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ letterSpacing: 0.5, width: 50 }}
            >
              Email:
            </Typography>
            <Typography variant="subtitle2" sx={{ letterSpacing: 0.5 }}>
              {user.email}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ marginBottom: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ letterSpacing: 0.5, width: 50 }}
            >
              Rola:
            </Typography>
            <Typography variant="subtitle2" sx={{ letterSpacing: 0.5 }}>
              {user.role}
            </Typography>
          </Stack>
        </List>
        <Typography
          variant="subtitle1"
          sx={{
            marginTop: 2,
            letterSpacing: 1,
            color: "text.primary",
            marginBottom: 1,
            fontWeight: "medium",
          }}
        >
          Motyw aplikacji
        </Typography>
        <FormControlLabel
          disabled={status !== "succeeded"}
          label={checkedTheme ? "Ciemny" : "Jasny"}
          control={<Switch checked={checkedTheme} onChange={handleChange} />}
        />
      </Paper>
    </Box>
  );
};

export default AccountPage;
