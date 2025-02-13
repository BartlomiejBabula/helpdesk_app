import { combineSlices } from "@reduxjs/toolkit";
import userSlice from "./user/UserSlice";
import jobsSlice from "./jobs/JobsSlice";
import reportsSlice from "./reports/ReportsSlice";
import storesSlice from "./stores/StoresSlice";
import gicaSlice from "./gica/GicaSlice";
import zabbixSlice from "./zabbix/ZabbixSlice";
import scheduleSlice from "./schedules/ScheduleSlice";

export const rootReducer = combineSlices({
  user: userSlice,
  jobs: jobsSlice,
  reports: reportsSlice,
  stores: storesSlice,
  gica: gicaSlice,
  zabbix: zabbixSlice,
  schedules: scheduleSlice,
});
