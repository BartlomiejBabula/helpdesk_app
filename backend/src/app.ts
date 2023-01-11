import express, { Application, Request, Response } from "express";
import { users, login, auth, logout } from "./routes/users";
import { stores } from "./routes/stores";
import { reports } from "./routes/reports";

const cors = require("cors");
require("dotenv").config();

export const TOKEN = process.env.TOKEN;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: `Welcome to the Helpdesk API!`,
  });
});

// enable corse for all origins
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Expose-Headers", "x-total-count");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
//   res.header("Access-Control-Allow-Headers", "Content-Type,authorization");
//   next();
// });

app.use("/users", users);
app.use("/stores", stores);
app.use("/login", login);
app.use("/logout", logout);
app.use("/refresh-token", auth);
app.use("/reports", reports);
