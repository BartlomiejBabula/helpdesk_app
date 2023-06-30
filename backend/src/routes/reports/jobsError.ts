import { Request, Response } from "express";

const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
import { samboDbConfig } from "../../app";

export const getJobsWithError = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    let conn = await oracledb.getConnection(samboDbConfig);
    const result = await conn.execute(
      "select s.store_number, j.* from s_jobs j join es_stores s on j.org_id = s.org_id where j.queue like '%Queue' and j.status in ('P','R','B') and j.org_id = s.org_id and error_message is not null"
    );
    res.status(201).json(result.rows);
    await conn.close();
  } catch (e) {
    next(e);
  }
};
