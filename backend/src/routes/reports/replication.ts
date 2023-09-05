import { NextFunction, Request, Response } from "express";
import { samboDbConfig } from "../../app";

const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export const getReplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let conn = await oracledb.getConnection(samboDbConfig);
    await conn.execute(
      `alter session set NLS_DATE_FORMAT = 'yyyy-mm-dd HH24:MI:SS'`
    );
    const replicationRequest = await conn.execute(
      `select 
      c.capture_time "PROD_TIME", 
      b.capture_time "REPLICATION_TIME", 
      (select extract(second from (M.CAPTURE_TIME - W.CAPTURE_TIME)) + 
               extract(minute from (M.CAPTURE_TIME - W.CAPTURE_TIME)) * 60 + extract(hour from (M.CAPTURE_TIME - W.CAPTURE_TIME)) * 3600 + 
               extract(day from (M.CAPTURE_TIME - W.CAPTURE_TIME)) * 3600 * 24 as "DELAY" from  REP_HEART_BEAT M, REP_HEART_BEAT_WH W) "DELAY_SECONDS" 
      from REP_HEART_BEAT c, REP_HEART_BEAT_WH b`,
      [],
      {
        resultSet: true,
      }
    );
    const rs = replicationRequest.resultSet;
    let replication = await rs.getRows();
    await rs.close();
    await conn.close();
    res.status(201).json(replication);
  } catch (e) {
    next(e);
  }
};
