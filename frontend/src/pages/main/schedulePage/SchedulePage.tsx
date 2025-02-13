import { Box, Typography, Button, Paper, List, Tooltip } from "@mui/material";
import { useAppSelector } from "../../../redux/AppStore";
import OnIcon from "@mui/icons-material/RadioButtonChecked";
import OffIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate } from "react-router-dom";
import { ScheduleType } from "../../../redux/types";
import { schedulesSelector } from "../../../redux/schedules/ScheduleSlice";

const SchedulePage = () => {
  let schedules: ScheduleType[] = useAppSelector(schedulesSelector);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        padding: 2,
        overflow: "scroll",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          letterSpacing: 2,
          color: "text.primary",
          marginBottom: 2,
          marginLeft: 1,
        }}
      >
        Automatyczne Procesy
      </Typography>
      <List>
        {schedules.map((item, key: number) => {
          return (
            <Paper
              key={key}
              variant="outlined"
              sx={{
                marginBottom: 2,
                display: "flex",
                flexDirection: "row",
                padding: 2.2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    marginLeft: 1,
                    letterSpacing: 1,
                    color: "text.primary",
                    fontWeight: "medium",
                    width: 350,
                  }}
                >
                  {item.name}
                </Typography>
                <Tooltip title={item.isActive ? "Aktywny" : "Nieaktywny"}>
                  {item.isActive ? (
                    <OnIcon sx={{ fontSize: 20 }} color="primary" />
                  ) : (
                    <OffIcon sx={{ fontSize: 20 }} color="primary" />
                  )}
                </Tooltip>
              </Box>
              <Tooltip title="Harmonogram w formacie cron">
                <Typography variant="subtitle1" sx={{ cursor: "help" }}>
                  {item.schedule}
                </Typography>
              </Tooltip>
              <Button
                sx={{ width: 120 }}
                color="secondary"
                onClick={() => {
                  navigate({ pathname: `./${item.task}` });
                }}
                variant="contained"
                size="small"
              >
                Edytuj
              </Button>
            </Paper>
          );
        })}
      </List>
    </Box>
  );
};

export default SchedulePage;
