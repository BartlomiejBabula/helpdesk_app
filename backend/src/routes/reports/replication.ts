import { Request, Response } from "express";
import { replicationDbConfig } from "../../app";

const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export const getReplication = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    let conn = await oracledb.getConnection(replicationDbConfig);
    await conn.execute(
      `alter session set NLS_DATE_FORMAT = 'yyyy-mm-dd HH24:MI:SS'`
    );
    // const replicationRequest = await conn.execute(
    //   `Select Sysdate,
    //   P.Applied_Message_Create_Time dane_zreplikowane,
    //   Round((Apply_Time - Applied_Message_Create_Time)*24,1) A,
    //   Round((Sysdate - Apply_Time )*24*3600,1) B,
    //   Round((Sysdate-Applied_Message_Create_Time )*24,1) C
    //    From Dba_Apply_Progress P`,
    //   [],
    //   {
    //     resultSet: true,
    //   }
    // );
    const replicationRequest = await conn.execute(
      `select sysdate,
      sysdate - 1/24 dane_zreplikowane, 
      Round(0.000011*24*3600,1) A, 
      Round(0.00011*24*3600,1) B, 
      Round(0.000*24*3600,1) C 
      from dual`,
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
