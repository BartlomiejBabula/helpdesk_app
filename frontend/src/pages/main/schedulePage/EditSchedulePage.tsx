import {
  Box,
  Typography,
  Button,
  Select,
  FormControl,
  MenuItem,
  Paper,
  FormControlLabel,
  Checkbox,
  Switch,
  AlertProps,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/AppStore";
import { useNavigate } from "react-router-dom";
import { FormikValues, useFormik } from "formik";
import { CronEncode } from "../../../function/cron";
import * as yup from "yup";
import JiraComponent from "./jiraComponent";
import { ScheduleType } from "../../../redux/types";
import { schedulesSelector } from "../../../redux/schedules/ScheduleSlice";
import { useState } from "react";
import SnackbarAlert from "../../../components/SnackbarAlert";
import { editSchedule } from "../../../redux/schedules/editSchedule";

const daysOfWeek: { name: string; value: string }[] = [
  { name: "Wszystkie", value: "*" },
  { name: "Poniedziałek", value: "1" },
  { name: "Wtorek", value: "2" },
  { name: "Środa", value: "3" },
  { name: "Czwartek", value: "4" },
  { name: "Piątek", value: "5" },
  { name: "Sobota", value: "6" },
  { name: "Niedziela", value: "7" },
];

const daysOfMonths = Array(31)
  .fill(0)
  .map((_, i) => i + 1);

const hours = Array(23)
  .fill(0)
  .map((_, i) => i + 1);

const minutes = Array(59)
  .fill(0)
  .map((_, i) => i + 1);

const EditSchedulePage = () => {
  const dispatch = useAppDispatch();
  let schedules: ScheduleType[] = useAppSelector(schedulesSelector);
  let newTask = schedules.filter(
    (schedule) => schedule.task === window.location.pathname.split("/").pop()
  );
  const [task, setTask] = useState<ScheduleType>(newTask[0]);
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const navigate = useNavigate();

  const selectFiltered = (arr: string[], value: string) => {
    if (arr[0] === "*" && arr.length > 1) {
      const filter = arr.filter((select) => select !== "*");
      formikCron.setFieldValue(value, filter);
    } else if (arr.filter((select) => select === "*").length === 1) {
      formikCron.setFieldValue(value, ["*"]);
      if (value === "hours") formikCron.setFieldValue("everyHours", false);
      if (value === "minutes") formikCron.setFieldValue("everyMinutes", false);
    } else {
      formikCron.setFieldValue(value, arr);
      if (arr.length > 1 && value === "hours")
        formikCron.setFieldValue("everyHours", false);
      if (
        (arr.length > 1 && value === "minutes") ||
        (arr[0] === "0" && value === "minutes")
      )
        formikCron.setFieldValue("everyMinutes", false);
    }
  };

  const formikCron = useFormik({
    validationSchema: yup.object().shape({
      minutes: yup.array().min(1, "Pole obowiązkowe"),
      hours: yup.array().min(1, "Pole obowiązkowe"),
      dayOfWeek: yup.array().min(1, "Pole obowiązkowe"),
      dayOfMonth: yup.array().min(1, "Pole obowiązkowe"),
    }),

    initialValues: {
      minutes: task ? task.cron.minutes : [],
      everyMinutes: task ? task.cron.everyMinutes : false,
      hours: task ? task.cron.hours : [],
      everyHours: task ? task.cron.everyHours : false,
      dayOfWeek: task ? task.cron.dayOfWeek : [],
      dayOfMonth: task ? task.cron.dayOfMonth : [],
      isActive: task ? task.isActive : false,
      description: task ? task.description : "",
    },
    onSubmit: async (values: FormikValues, { resetForm }) => {
      const croneObject = {
        minutes: values.minutes,
        everyMinutes: values.everyMinutes,
        hours: values.hours,
        everyHours: values.everyHours,
        dayOfMonth: values.dayOfMonth,
        month: task.cron.month,
        dayOfWeek: values.dayOfWeek,
      };
      const cron = CronEncode(croneObject);
      const postSchedule = {
        task: task.task,
        schedule: cron,
        isActive: values.isActive,
        description: values.description,
      };
      dispatch(editSchedule(postSchedule));
      setSnackbar({
        children: "Harmonogram został zapisany",
        severity: "success",
      });
    },
  });
  return (
    task && (
      <Box
        sx={{
          height: "100%",
          position: "relative",
          padding: 2,
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
          Harmonogram procesu: {task.name}
        </Typography>
        <form onSubmit={formikCron.handleSubmit} style={{ display: "flex" }}>
          <Paper
            variant="outlined"
            sx={{
              height: 430,
              marginTop: 2,
              padding: 1,
              paddingLeft: 2,
              position: "relative",
              width: "50%",
              minWidth: 560,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  letterSpacing: 1,
                  marginRight: 2,
                  color: "text.primary",
                  fontWeight: "medium",
                  width: 130,
                }}
              >
                Dzień tygodnia
              </Typography>
              <FormControl sx={{ width: 200 }}>
                <Select
                  size="small"
                  multiple
                  value={formikCron.values.dayOfWeek}
                  onChange={(e) => {
                    selectFiltered(e.target.value, "dayOfWeek");
                  }}
                  error={
                    formikCron.touched.dayOfWeek &&
                    Boolean(formikCron.errors.dayOfWeek)
                  }
                >
                  {daysOfWeek.map((type) => (
                    <MenuItem key={type.name} value={type.value}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  letterSpacing: 1,
                  marginRight: 2,
                  color: "text.primary",
                  fontWeight: "medium",
                  width: 130,
                }}
              >
                Dzień miesiąca
              </Typography>
              <FormControl sx={{ width: 200 }}>
                <Select
                  size="small"
                  multiple
                  value={formikCron.values.dayOfMonth}
                  onChange={(e) => {
                    selectFiltered(e.target.value, "dayOfMonth");
                  }}
                  error={
                    formikCron.touched.dayOfMonth &&
                    Boolean(formikCron.errors.dayOfMonth)
                  }
                >
                  <MenuItem value={"*"}>Wszystkie</MenuItem>
                  {daysOfMonths.map((day, key) => (
                    <MenuItem key={key} value={`${day}`}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  letterSpacing: 1,
                  marginRight: 2,
                  color: "text.primary",
                  fontWeight: "medium",
                  width: 130,
                }}
              >
                Godzina
              </Typography>
              <FormControl sx={{ width: 200 }}>
                <Select
                  multiple
                  size="small"
                  value={formikCron.values.hours}
                  onChange={(e) => {
                    selectFiltered(e.target.value, "hours");
                  }}
                  error={
                    formikCron.touched.hours && Boolean(formikCron.errors.hours)
                  }
                >
                  <MenuItem value={"*"}>Wszystkie</MenuItem>
                  {hours.map((hour, key) => (
                    <MenuItem key={key} value={`${hour}`}>
                      {hour}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                sx={{ marginLeft: 3 }}
                disabled={
                  formikCron.values.hours[0] === "*" ||
                  formikCron.values.hours.length > 1
                }
                control={
                  <Checkbox
                    checked={formikCron.values.everyHours}
                    onChange={(e) => {
                      formikCron.setFieldValue("everyHours", e.target.checked);
                    }}
                  />
                }
                label="Co każde"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  letterSpacing: 1,
                  marginRight: 2,
                  color: "text.primary",
                  fontWeight: "medium",
                  width: 130,
                }}
              >
                Minuta
              </Typography>
              <FormControl sx={{ width: 200 }}>
                <Select
                  multiple
                  size="small"
                  value={formikCron.values.minutes}
                  onChange={(e) => {
                    selectFiltered(e.target.value, "minutes");
                  }}
                  error={
                    formikCron.touched.minutes &&
                    Boolean(formikCron.errors.minutes)
                  }
                >
                  <MenuItem value={"0"}>0</MenuItem>
                  {minutes.map((minute, key) => (
                    <MenuItem key={minute} value={`${minute}`}>
                      {minute}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                sx={{ marginLeft: 3 }}
                disabled={
                  formikCron.values.minutes[0] === "0" ||
                  formikCron.values.minutes.length > 1
                }
                control={
                  <Checkbox
                    checked={formikCron.values.everyMinutes}
                    onChange={(e) => {
                      formikCron.setFieldValue(
                        "everyMinutes",
                        e.target.checked
                      );
                    }}
                  />
                }
                label="Co każde"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  letterSpacing: 1,
                  marginRight: 2,
                  color: "text.primary",
                  fontWeight: "medium",
                  width: 130,
                }}
              >
                Harmonogram
              </Typography>
              <FormControlLabel
                label={formikCron.values.isActive ? "Włączony" : "Wyłączony"}
                control={
                  <Switch
                    checked={formikCron.values.isActive}
                    onChange={(e) => {
                      formikCron.setFieldValue("isActive", e.target.checked);
                    }}
                  />
                }
              />
            </Box>
            <Box sx={{ marginTop: 7, textAlign: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  width: 70,
                }}
                type="submit"
              >
                ZAPISZ
              </Button>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  marginLeft: 20,
                  width: 70,
                }}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Wróć
              </Button>
            </Box>
          </Paper>
          {task.task === "JiraTaskRegister" && (
            <JiraComponent
              description={formikCron.values.description}
              onChange={formikCron.handleChange}
            />
          )}
        </form>
        <SnackbarAlert alert={snackbar} />
      </Box>
    )
  );
};

export default EditSchedulePage;
