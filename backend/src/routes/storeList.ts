import { Router, Request, Response } from "express";
import { authJWTMiddleware } from "./users";
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
import { samboDbConfig } from "../app";

export const storeList = Router();

storeList.post(
  "/",
  authJWTMiddleware,
  async (req: Request, res: Response, next) => {
    try {
      let conn = await oracledb.getConnection(samboDbConfig);
      const result = await conn.execute(
        `select * from es_stores where status in (${req.body.type}) and store_type in (${req.body.storeType})`
      );
      let storeList: any = [];
      result.rows.forEach((store: { STORE_NUMBER: string }) => {
        storeList = [...storeList, store.STORE_NUMBER];
      });
      res.status(201).json(storeList);
      await conn.close();
    } catch (e) {
      next(e);
    }
  }
);
