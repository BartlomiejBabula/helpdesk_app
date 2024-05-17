import { combineSlices } from "@reduxjs/toolkit";
import userSlice from "./user/UserSlice";
import jiraSlice from "./jira/JiraSlice";
import jobsSlice from "./jobs/JobsSlice";
import reportsSlice from "./reports/ReportsSlice";
import storesSlice from "./stores/StoresSlice";
import gicaSlice from "./gica/GicaSlice";
import zabbixSlice from "./zabbix/ZabbixSlice";

export const rootReducer = combineSlices({
  user: userSlice,
  jira: jiraSlice,
  jobs: jobsSlice,
  reports: reportsSlice,
  stores: storesSlice,
  gica: gicaSlice,
  zabbix: zabbixSlice,
});
