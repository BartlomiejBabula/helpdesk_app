import { Request, Response } from "express";
import { getUserEmail, setBlockRaport, unBlockRaport } from "./reports";
import { transporter } from "../../config/nodemailer";
import xlsx from "node-xlsx";

const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
import { samboDbConfig } from "../../app";

const getActiveStores = async () => {
  let conn = await oracledb.getConnection(samboDbConfig);
  const activeStoresSQL = await conn.execute(
    "select count(*) as stores from es_stores where status ='A'",
    [],
    {
      resultSet: true,
    }
  );
  const rs = activeStoresSQL.resultSet;
  let activeStores = await rs.getRow();
  await rs.close();
  await conn.close();
  return activeStores.STORES;
};

const getGRP_DATA = async () => {
  let conn = await oracledb.getConnection(samboDbConfig);
  await conn.execute(
    `alter session set NLS_DATE_FORMAT = 'yyyy-mm-dd HH24:MI:SS'`
  );
  const GRP_DATASQL = await conn.execute(
    `Select Sysdate, Name,Total_Mb,Free_Mb,Round(Free_Mb/Total_Mb*100,2) as Free ,Round(100-(Free_Mb/Total_Mb*100),2) as Used From V$asm_Diskgroup
    Where Name In ('GRP_ARCH','GRP_DATA')`,
    [],
    {
      resultSet: true,
    }
  );
  const rs = GRP_DATASQL.resultSet;
  let GRP_DATA = await rs.getRows();
  await rs.close();
  await conn.close();
  return GRP_DATA[1];
};

const getDatabaseSize = async () => {
  let conn = await oracledb.getConnection(samboDbConfig);
  const databaseSizeSQL = await conn.execute(
    `select
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 1) )) as day1,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 2) )) as day2,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 3) )) as day3,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 4) )) as day4,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 5) )) as day5,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 6) )) as day6,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 7) )) as day7,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 8) )) as day8,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 9) )) as day9,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 10) )) as day10,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 11) )) as day11,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 12) )) as day12,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 13) )) as day13,
    (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 14) )) as day14
    from dual`,
    [],
    {
      resultSet: true,
    }
  );
  const rs = databaseSizeSQL.resultSet;
  let databaseSize = await rs.getRows();
  await rs.close();
  await conn.close();
  return databaseSize;
};

const getTable = async () => {
  let conn = await oracledb.getConnection(samboDbConfig);
  await conn.execute(
    `alter session set NLS_DATE_FORMAT = 'yyyy-mm-dd HH24:MI:SS'`
  );
  const tableSQL = await conn.execute(
    `select * from table( MONI_REPORT_DB_2WEE.report_DB_2Wee ( 14 ) )`,
    [],
    {
      resultSet: true,
    }
  );
  const rs = tableSQL.resultSet;
  let table = await rs.getRows();
  await rs.close();
  await conn.close();
  return table;
};

export const runVolumetrics = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    setBlockRaport("volumetrics", req, res, next);
    const email = await getUserEmail(req);
    const fs = require("fs");
    const path = require("path");
    let child_process = require("child_process");
    fs.existsSync("/usr/src/app/src/scripts/Wolumetryka.xlsx") &&
      fs.unlink("/usr/src/app/src/scripts/Wolumetryka.xlsx", (err: any) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    const activeStores = await getActiveStores();
    const grpData = await getGRP_DATA();
    const databaseSize = await getDatabaseSize();
    const table = await getTable();

    var workSheets = xlsx.parse(__dirname + "/RAPORT BAZY.xlsx");

    // child_process.exec(
    //   `python3 /usr/src/app/src/scripts/Raport_wolumetryka.py`,
    //   function (err: any, stdout: any, stderr: any) {
    //     if (err) {
    //       console.log("child processes failed with error code: " + err);
    //     }
    //     transporter
    //       .sendMail({
    //         attachments: [
    //           {
    //             filename: `Wolumetryka.xlsx`,
    //             path: path.join("/usr/src/app/src/scripts/Wolumetryka.xlsx"),
    //           },
    //         ],
    //         from: '"Bartek Babula" <babula.software@gmail.com>',
    //         to: email,
    //         subject: "Dane do Wolumetryki",
    //         text: "There is a new article. It's about sending emails, check it out!",
    //         html: `<p>Cześć,</p>
    //               <p>w załączniku przesyłam pliki z danymi do raportu Wolumetryki</p>`,
    //       })
    //       .then((info: any) => {
    //         console.log({ info });
    //         fs.existsSync("/usr/src/app/geckodriver.log") &&
    //           fs.unlink("/usr/src/app/geckodriver.log", (err: any) => {
    //             if (err) {
    //               console.error(err);
    //               return;
    //             }
    //           });
    //         unBlockRaport("volumetrics");
    //       })
    //       .catch(console.error);
    //   }
    // );
  } catch (e) {
    next(e);
  }
};
