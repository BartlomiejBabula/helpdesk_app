import { Router, Request, Response } from "express";
import { authJWTMiddleware } from "./users";
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
import { samboDbConfig } from "../app";

export const job = Router();

job.post(
  "/end",
  authJWTMiddleware,
  async (req: Request, res: Response, next) => {
    try {
      const id = req.body.id;
      // let conn = await oracledb.getConnection(samboDbConfig);
      // await conn.execute(`update s_jobs set status = 'E' where id = '${id}'`);
      // await conn.commit();
      // await conn.close();
      res.status(201).json(id);
    } catch (e) {
      next(e);
    }
  }
);

job.post(
  "/restart",
  authJWTMiddleware,
  async (req: Request, res: Response, next) => {
    try {
      const id = req.body.id;
      // let conn = await oracledb.getConnection(samboDbConfig);
      // await conn.execute(
      //   `update s_jobs set status = 'R', tm_restart = sysdate where id = '${id}'`
      // );
      // await conn.commit();
      // await conn.close();
      res.status(201).json(id);
    } catch (e) {
      next(e);
    }
  }
);

job.get("/", authJWTMiddleware, async (req: Request, res: Response, next) => {
  try {
    let conn = await oracledb.getConnection(samboDbConfig);
    const result = await conn.execute(
      "select s.store_number, j.* from s_jobs j join es_stores s on j.org_id = s.org_id where j.queue like '%Queue' and j.status in ('P','R','B')"
    );
    res.status(201).json(result.rows);
    await conn.close();
  } catch (e) {
    next(e);
  }
});
