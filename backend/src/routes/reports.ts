import { Router, Request, Response } from "express";
import { authJWTMiddleware } from "./users";
import { transporter } from "./../config/nodemailer";

export const reports = Router();
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const config = {
  user: "ESAMBO_TEST",
  password: "sasasa",
  poolMin: 20,
  poolIncrement: 0,
  poolMax: 20,
  connectString:
    "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=10.5.0.128)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=esambo)))",
};

reports.get(
  "/",
  //   authJWTMiddleware,
  async (req: Request, res: Response, next) => {
    try {
      // transporter
      //   .sendMail({
      //     from: '"Bartek Babula" <babula.software@gmail.com>', // sender address
      //     to: "babula.bartlomiej@gmail.com", // list of receivers
      //     subject: "Test", // Subject line
      //     text: "There is a new article. It's about sending emails, check it out!", // plain text body
      //     html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
      //   })
      //   .then((info: any) => {
      //     console.log({ info });
      //   })
      //   .catch(console.error);

      let conn = await oracledb.getConnection(config);

      const result = await conn.execute(
        "select * from es_stores where store_number = 'A88';"
      );

      console.log(result.rows[0]);
      let date_today = new Date().toJSON().slice(0, 10);
      res.status(201).json(result.rows[0]);
      await conn.close();
    } catch (e) {
      next(e);
    }
  }
);
