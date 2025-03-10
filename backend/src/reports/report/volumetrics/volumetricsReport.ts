import { LogTaskType } from 'src/logger/dto/createLog';
import { LogStatus } from 'src/logger/dto/getLog';
import { LoggerService } from 'src/logger/logger.service';
import { EMAIL, transporter } from 'src/nodemailer';
import axios from 'axios';
import { samboDbConfig } from '../../../samboDB';

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const XlsxPopulate = require('xlsx-populate');
const zabbixUser = process.env.ZABBIX_USER;
const zabbixPassword = process.env.ZABBIX_PASSWORD;
const zabbixUrl = process.env.ZABBIX_URL;
const path = require('path');

const getStores = async (workbook) => {
  let conn = await oracledb.getConnection(samboDbConfig);
  const stores = await conn.execute(
    "select count(*) as CNT from es_stores where status ='A'",
  );
  await conn.close();
  workbook.sheet('Obliczenia').cell('F3').value(stores.rows[0].CNT);
};

const getZabbixToken = async () => {
  let zabbixToken = '';
  await axios
    .post(zabbixUrl, {
      jsonrpc: '2.0',
      method: 'user.login',
      params: { username: zabbixUser, password: zabbixPassword },
      id: 1,
    })
    .then((res) => {
      zabbixToken = res.data.result;
    });

  return zabbixToken;
};

const getWorkTime = async (zabbixToken: string, workbook) => {
  let dbFree = '';
  let dbTotal = '';
  let dbUsed = '';

  await axios
    .post(
      zabbixUrl,
      {
        jsonrpc: '2.0',
        method: 'item.get',
        params: { output: 'extend', itemids: '48192', sortfield: 'name' },
        id: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${zabbixToken}`,
        },
      },
    )
    .then(async (res) => {
      const data = JSON.parse(res.data.result[0].lastvalue);
      dbFree = (parseFloat(data.bytes.free) / 1024 / 1024 / 1024).toFixed(2);
      dbUsed = (parseFloat(data.bytes.used) / 1024 / 1024 / 1024).toFixed(2);
      dbTotal = (parseFloat(data.bytes.total) / 1024 / 1024 / 1024).toFixed(2);
    });
  workbook.sheet('Obliczenia').cell('B16').value(dbTotal);
  workbook.sheet('Obliczenia').cell('B17').value(dbUsed);
  workbook.sheet('Obliczenia').cell('B18').value(dbFree);
};

const getDbSize = async (workbook) => {
  let conn = await oracledb.getConnection(samboDbConfig);
  const dbSize = await conn.execute(
    `select
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 1) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 2) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 3) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 4) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 5) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 6) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 7) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 8) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 9) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 10) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 11) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 12) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 13) )),
   (select (SUM(size_MB)/1024)   from User_Segments_Hist  where (snap_date = trunc(sysdate - 14) ))
   from dual`,
  );
  await conn.close();
  for (let day = 1; day <= 14; day++) {
    let date = new Date();
    date.setDate(date.getDate() - day);
    let m = '' + (date.getMonth() + 1);
    let d = '' + date.getDate();
    let y = date.getFullYear();
    if (m.length < 2) m = '0' + m;
    if (d.length < 2) d = '0' + d;
    workbook
      .sheet('Obliczenia')
      .cell(`A${43 - day}`)
      .value(`${y}.${m}.${d}`);
    workbook
      .sheet('Obliczenia')
      .cell(`B${43 - day}`)
      .value(Object.values(dbSize.rows[0])[day - 1]);
  }
};

const getTable = async (workbook) => {
  let connect = await oracledb.getConnection(samboDbConfig);
  await connect.execute(
    `alter session set NLS_DATE_FORMAT = 'yyyy-mm-dd HH24:MI:SS'`,
  );
  const table = await connect.execute(
    'select * from table( MONI_REPORT_DB_2WEE.report_DB_2Wee ( 14 ) )',
  );
  await connect.close();

  let summaryE = 0;
  let summaryF = 0;
  let summaryG = 0;
  let summaryH = 0;
  for (let i = 0; i < 12; i++) {
    workbook
      .sheet('Tabela')
      .cell(`E${5 + i}`)
      .value(table.rows[i].ROZMIAR_POPRZEDNI_GB);
    workbook
      .sheet('Tabela')
      .cell(`F${5 + i}`)
      .value(table.rows[i].ROZMIAR_AKTUALNY_GB);
    workbook
      .sheet('Tabela')
      .cell(`G${5 + i}`)
      .value(table.rows[i].SR_DZIENNY_PRZYROST_MB);
    workbook
      .sheet('Tabela')
      .cell(`H${5 + i}`)
      .value(table.rows[i].SR_DZIENNY_PRZYROST_NA_SKL_MB);

    if (table.rows[i].PRZYROST_GB > 0) {
      workbook
        .sheet('Tabela')
        .cell(`I${5 + i}`)
        .value('wzrost');
    } else {
      workbook
        .sheet('Tabela')
        .cell(`I${5 + i}`)
        .value('spadek');
    }

    if (
      workbook
        .sheet('Tabela')
        .cell(`G${5 + i}`)
        .value() <= 0
    ) {
      workbook
        .sheet('Tabela')
        .cell(`G${5 + i}`)
        .value(0);
    } else
      summaryG =
        summaryG +
        workbook
          .sheet('Tabela')
          .cell(`G${5 + i}`)
          .value();

    if (
      workbook
        .sheet('Tabela')
        .cell(`H${5 + i}`)
        .value() <= 0
    ) {
      workbook
        .sheet('Tabela')
        .cell(`H${5 + i}`)
        .value(0);
    } else
      summaryH =
        summaryH +
        workbook
          .sheet('Tabela')
          .cell(`H${5 + i}`)
          .value();

    summaryE =
      summaryE +
      workbook
        .sheet('Tabela')
        .cell(`E${5 + i}`)
        .value();
    summaryF =
      summaryF +
      workbook
        .sheet('Tabela')
        .cell(`F${5 + i}`)
        .value();
  }

  workbook.sheet('Tabela').cell(`E17`).value(summaryE);
  workbook.sheet('Tabela').cell(`F17`).value(summaryF);
  workbook.sheet('Tabela').cell(`G17`).value(summaryG);
  workbook.sheet('Tabela').cell(`H17`).value(summaryH);
};

const getZabbix = async (zabbixToken: string, workbook) => {
  const WS = [46825, 46898];
  let averageLoad = [];
  for (let i = 0; i <= 1; i++) {
    for (let day = 1; day <= 7; day++) {
      let averageValues = [];
      const timeFrom = new Date();
      const timeTill = new Date();
      timeFrom.setDate(timeFrom.getDate() - day);
      timeTill.setDate(timeTill.getDate() - day);
      timeFrom.setMinutes(0);
      timeTill.setMinutes(59);
      timeFrom.setSeconds(0);
      timeTill.setSeconds(59);

      for (let h = 0; h < 24; h++) {
        let hoursValueArray = [];
        timeFrom.setHours(h);
        timeTill.setHours(h);
        await axios
          .post(
            zabbixUrl,
            {
              jsonrpc: '2.0',
              method: 'history.get',
              params: {
                output: 'extend',
                history: 0,
                time_from: Math.floor(timeFrom.getTime() / 1000),
                time_till: Math.floor(timeTill.getTime() / 1000),
                itemids: WS[i],
                sortfield: 'clock',
                sortorder: 'DESC',
              },
              id: 1,
            },
            {
              headers: {
                Authorization: `Bearer ${zabbixToken}`,
              },
            },
          )
          .then(async (res) => {
            await res.data.result.map((data) => {
              hoursValueArray = [...hoursValueArray, parseFloat(data.value)];
            });
          });
        if (hoursValueArray.length > 1) {
          let av = Math.ceil(
            hoursValueArray.reduce((a, b) => a + b) / hoursValueArray.length,
          );
          averageValues = [...averageValues, av];
        }
      }
      let date = new Date();
      date.setDate(date.getDate() - day);
      let m = '' + (date.getMonth() + 1);
      let d = '' + date.getDate();
      let y = date.getFullYear();
      if (m.length < 2) m = '0' + m;
      if (d.length < 2) d = '0' + d;

      if (i === 0) {
        workbook
          .sheet('Obliczenia')
          .cell(`A${12 - day}`)
          .value(`${d}.${m}.${y}`);
        workbook
          .sheet('Obliczenia')
          .cell(`B${12 - day}`)
          .value(Math.max(...averageValues));
      }
      if (i === 1) {
        workbook
          .sheet('Obliczenia')
          .cell(`C${12 - day}`)
          .value(Math.max(...averageValues));
        workbook
          .sheet('Obliczenia')
          .cell(`F${12 - day}`)
          .value(Math.max(...averageValues));
        workbook
          .sheet('Obliczenia')
          .cell(`F${12 - day}`)
          .value(
            (workbook
              .sheet('Obliczenia')
              .cell(`B${12 - day}`)
              .value() +
              workbook
                .sheet('Obliczenia')
                .cell(`C${12 - day}`)
                .value()) /
              2,
          );
        averageLoad = [
          ...averageLoad,
          workbook
            .sheet('Obliczenia')
            .cell(`F${12 - day}`)
            .value(),
        ];
      }
    }
  }
  let average = averageLoad.reduce((a, b) => a + b) / averageLoad.length;
  for (let av = 0; av <= 7; av++) {
    if (averageLoad[av] < average / 3.333) {
      averageLoad[av] = 0;
    }
  }
  workbook
    .sheet('Obliczenia')
    .cell(`F13`)
    .value(averageLoad.reduce((a, b) => a + b) / averageLoad.length);
  workbook
    .sheet('Obliczenia')
    .cell(`F14`)
    .value(
      averageLoad.reduce((a, b) => a + b) /
        averageLoad.length /
        workbook.sheet('Obliczenia').cell(`F3`).value(),
    );

  workbook
    .sheet('Obliczenia')
    .cell(`G3`)
    .value(90 / workbook.sheet('Obliczenia').cell(`F14`).value());
  workbook
    .sheet('Obliczenia')
    .cell(`H3`)
    .value(workbook.sheet('Obliczenia').cell(`G3`).value() / 2);
  workbook
    .sheet('Tabela')
    .cell(`J17`)
    .value(workbook.sheet('Tabela').cell(`G17`).value() / 1024);
  workbook
    .sheet('Obliczenia')
    .cell(`B19`)
    .value(workbook.sheet('Tabela').cell(`J17`).value());
  workbook
    .sheet('Obliczenia')
    .cell(`B20`)
    .value(
      workbook.sheet('Obliczenia').cell(`B18`).value() /
        workbook.sheet('Obliczenia').cell(`B19`).value(),
    );
};

export async function generateVolumetrics(
  email: string,
  loggerService: LoggerService,
  createdBy: string,
) {
  const logId = await loggerService.createLog({
    task: LogTaskType.VOLUMETRIC_REPORT,
    status: LogStatus.OPEN,
    orderedBy: createdBy,
  });

  await XlsxPopulate.fromFileAsync(
    path.join('/usr/src/app/src/reports/report/volumetrics/RAPORT BAZY.xlsx'),
  )
    .then(async (workbook) => {
      const zabbixToken = await getZabbixToken();
      await getStores(workbook);
      await getWorkTime(zabbixToken, workbook);
      await getDbSize(workbook);
      await getTable(workbook);
      await getZabbix(zabbixToken, workbook);
      return workbook.outputAsync();
    })
    .then((data) => {
      transporter.sendMail({
        attachments: [
          {
            filename: 'wolumetryka.xlsx',
            content: data,
          },
          {
            filename: `eSambo wolumetryka serwerów.doc`,
            path: path.join(
              '/usr/src/app/src/reports/report/volumetrics/eSambo wolumetryka serwerów.doc',
            ),
          },
        ],
        from: EMAIL,
        to: email,
        subject: 'Dane do Wolumetryki',
        html: `<p>Cześć,</br>
            </br>
w załączniku przesyłam pliki z danymi do raportu Wolumetryki,</br>
do wszystkich potrzebnych danych należy pobrać wykres pamięci z Enterprise Managera, zgodnie z artykułem na wiki.</br>
</br>
Artykuł na wiki:</br>
<link>https://wiki.skg.pl/wiki/index.php/Raport_-_Wolumetryka_serwer%C3%B3w</link></p>`,
      });
      loggerService.createLog({
        taskId: logId,
        task: LogTaskType.VOLUMETRIC_REPORT,
        status: LogStatus.IN_PROGRESS,
        orderedBy: createdBy,
        description: `Email sent`,
      });
    })
    .catch((err) => {
      loggerService.createLog({
        taskId: logId,
        task: LogTaskType.VOLUMETRIC_REPORT,
        status: LogStatus.IN_PROGRESS,
        orderedBy: createdBy,
        description: `${err}`,
      });
    });
  await loggerService.createLog({
    taskId: logId,
    task: LogTaskType.VOLUMETRIC_REPORT,
    status: LogStatus.DONE,
    orderedBy: createdBy,
  });
}
