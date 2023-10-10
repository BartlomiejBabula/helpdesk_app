import express, { Application, Request, Response } from "express";
import { users, login, auth, logout } from "./routes/users";
import { stores } from "./routes/stores";
import { reports } from "./routes/reports/reports";
import { jira } from "./routes/jira";
import { job } from "./routes/job";
import { replication } from "./routes/replication";

const cors = require("cors");
require("dotenv").config();

export const TOKEN = process.env.TOKEN;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
export const SAMBO_TEST_IP = process.env.SAMBO_TEST_IP;
export const SAMBO_DEV_IP = process.env.SAMBO_DEV_IP;
export const SELENIUM_USER = process.env.SELENIUM_USER;
export const SELENIUM_PASSWORD = process.env.SELENIUM_PASSWORD;
export const FRANCHISE_STORE = process.env.FRANCHISE_STORE;

export const samboDbConfig = {
  user: process.env.SAMBODB_USER,
  password: process.env.SAMBODB_PASSWORD,
  poolMin: 20,
  poolIncrement: 0,
  poolMax: 20,
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.SAMBODB_IP})(PORT=${process.env.SAMBODB_PORT}))(CONNECT_DATA=(SERVER=DEDICATED)(SID=${process.env.SAMBODB_SID})))`,
};

export const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: `Welcome to the Helpdesk API!`,
  });
});

app.use("/users", users);
app.use("/stores", stores);
app.use("/login", login);
app.use("/logout", logout);
app.use("/refresh-token", auth);
app.use("/reports", reports);
app.use("/jira", jira);
app.use("/replication", replication);
app.use("/job", job);
