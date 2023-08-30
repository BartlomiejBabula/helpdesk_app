import { NextFunction, Request, Response } from "express";
import { EMAIL, transporter } from "../../config/nodemailer";
import xlsx from "node-xlsx";
import { samboDbConfig } from "../../app";
import { unBlockRaport, setBlockRaport, getUserEmail } from "./reports";

const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

interface SQL_STORE {
  STORE_NUMBER: string;
  CLOSE_OP_DATE: string;
  CREATE_DATE: string;
  DOC_SYMBOL: string;
}
interface SQL_GICA {
  STORE_NUMBER: string;
  TM_START: string;
  TM_END: string;
}

const getOrders = async () => {
  let conn = await oracledb.getConnection(samboDbConfig);
  const ordersRequest = await conn.execute(
    "select count(*) as SHOPLIST, status from s_jobs where  queue  = 'ApplyAutomaticGenerateOrdersQueue' and  status  in ('P','R','W') group by status",
    [],
    {
      resultSet: true,
    }
  );
  const rs = ordersRequest.resultSet;
  let orders = await rs.getRow();
  await rs.close();
  await conn.close();
  if (orders !== undefined) {
    return `1. GENERACJA ZAMÓWIEŃ NIEZAKOŃCZONA NA ${orders.SHOPLIST} SKLEPACH`;
  } else {
    return "1. Proces generowania zamówień zakończył się dla wszystkich sklepów.";
  }
};

const getMandala = async () => {
  let conn = await oracledb.getConnection(samboDbConfig);
  const mandalaRequest = await conn.execute(
    `select s.store_number, 'brak sprzedazy' as braki from es_stores s where not exists (select 1 from mandala_gen_counter m where s.store_number = m.store and m.gen_date = trunc(sysdate-1) and m.type in ('mov1SALES')) and s.store_type = 'N' and s.status = 'A'`,
    [],
    {
      resultSet: true,
    }
  );

  const rs = mandalaRequest.resultSet;
  let mandala = await rs.getRows();
  await rs.close();
  await conn.close();
  if (mandala !== undefined) {
    let mandalaArr: string[] = [];
    mandala.map(
      (item: { STORE_NUMBER: string; BRAKI: string }) =>
        (mandalaArr = [...mandalaArr, item.STORE_NUMBER])
    );
    return `2. Dane do Mandala niekompletne, brak danych dla sklepów ${mandalaArr.join(
      ", "
    )}`;
  } else {
    return "2. Dane do Mandala kompletne";
  }
};

const getWS = async (today: string, yest: string) => {
  let conn = await oracledb.getConnection(samboDbConfig);
  await conn.execute(
    `alter session set NLS_DATE_FORMAT = 'yyyy-mm-dd HH24:MI:SS'`
  );
  const WSRequest = await conn.execute(
    `select h.store_number, h.create_date, h.close_op_date,h.doc_symbol
      from es_doc_headers h
      -- where h.store_number in (select store_number from es_stores where org_id in (select org_id from ep_org_units where master_org_id in (18279650, 18361650)))
      where h.store_number in (select store_number from es_stores where store_type = 'N' and status = 'A')
      and h.id_doc_type = 'WS'
      and h.issue_date >= add_months('${today}', -1)
      and h.issue_date < '${today}'
      and h.status = 'C'
      --   and h.close_op_date >= '2018.05.01'
      and exists (select 1 from logging_event le where le.doc_id = h.doc_id and le.dtimestmp > '${yest} 18:00:00')
      order by h.store_number, h.doc_id`,
    [],
    {
      resultSet: true,
    }
  );
  const rs = WSRequest.resultSet;
  let WS = await rs.getRows();
  let WS_data: any = [["STORE", "DOC_SYMBOL", "CREATE_DATE", "CLOSE_OP_DATE"]];
  WS.map((sql_store: SQL_STORE) => {
    let dateStart = formatDate(new Date(sql_store.CREATE_DATE));
    let dateEnd = formatDate(new Date(sql_store.CLOSE_OP_DATE));

    let newWS = [
      sql_store.STORE_NUMBER,
      sql_store.DOC_SYMBOL,
      dateStart,
      dateEnd,
    ];
    WS_data = [...WS_data, newWS];
  });
  let buffer = xlsx.build([
    {
      name: "WS",
      data: WS_data,
      options: {
        "!cols": [{ width: 7 }, { width: 14 }, { width: 19 }, { width: 19 }],
      },
    },
  ]);
  await rs.close();
  await conn.close();
  return buffer;
};

const getGICA = async (today: string, yest: string) => {
  let conn = await oracledb.getConnection(samboDbConfig);
  await conn.execute(
    `alter session set NLS_DATE_FORMAT = 'yyyy-mm-dd HH24:MI:SS'`
  );
  const GICARequest = await conn.execute(
    `select store_number,to_char(tm_start,'yyyy.mm.dd hh24:mi:ss') as tm_start,to_char(tm_end,'yyyy.mm.dd hh24:mi:ss') as tm_end from
      s_jobs,
      es_stores
      where parent_id = ( select
        id
   from s_jobs
    where queue='PerformOperationQueue'
      and operation_code ='UpdateManagingStore'
      and tm_start >= '${yest}'
     )
      and s_jobs.org_id = es_stores.org_id
      and es_stores.store_type ='N'
      and s_jobs.TM_END >= '${today}'`,
    [],
    {
      resultSet: true,
    }
  );
  const rs = GICARequest.resultSet;
  let GICA = await rs.getRows();
  let GICA_data: any = [["SHOP", "START", "END"]];
  GICA.map((sql_gica: SQL_GICA, key: number) => {
    let gicaStart = formatDate(new Date(sql_gica.TM_START));
    let gicaEnd = formatDate(new Date(sql_gica.TM_END));
    let newWS = [sql_gica.STORE_NUMBER, gicaStart, gicaEnd];
    GICA_data = [...GICA_data, newWS];
  });
  let buffer = xlsx.build([
    {
      name: "Sheet",
      data: GICA_data,
      options: {
        "!cols": [{ width: 7 }, { width: 19 }, { width: 19 }],
      },
    },
  ]);
  await rs.close();
  await conn.close();
  if (GICA_data.length > 1) {
    return buffer;
  } else {
    return null;
  }
};

const getGICAEndStores = async (yest: string, storeType: "N" | "H") => {
  let conn = await oracledb.getConnection(samboDbConfig);
  await conn.execute(
    `alter session set NLS_DATE_FORMAT = 'yyyy-mm-dd HH24:MI:SS'`
  );
  const GICARequest = await conn.execute(
    `select store_number,to_char(tm_start,'yyyy.mm.dd hh24:mi:ss')as tm_start,to_char(tm_end,'yyyy.mm.dd hh24:mi:ss')as tm_end from
         s_jobs,
         es_stores
         where parent_id = ( select
           id
      from s_jobs
       where queue='PerformOperationQueue'
         and operation_code ='UpdateManagingStore'
         and tm_start >= '${yest}')
         and s_jobs.org_id = es_stores.org_id
         and es_stores.store_type ='${storeType}' order by tm_end desc`,
    [],
    {
      resultSet: true,
    }
  );
  const rs = GICARequest.resultSet;
  let GICA: SQL_GICA = await rs.getRow();
  await rs.close();
  await conn.close();
  if (GICA !== undefined) {
    return GICA.TM_END;
  } else {
    return "BRAK DANYCH";
  }
};

export const generateMorningReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const day = String(new Date().getDate()).padStart(2, "0");
    const day2 = String(new Date().getDate() - 1).padStart(2, "0");
    let today = `${year}-${month}-${day}`;
    let yest = `${year}-${month}-${day2}`;

    setBlockRaport("morning", req, res, next);
    console.log("generuje raport poranny");
    let orders_txt = await getOrders();
    let mandala_txt = await getMandala();
    let email = await getUserEmail(req);
    let gica = await getGICA(today, yest);
    let buffer = await getWS(today, yest);
    console.log("wysyłka raportu");
    let gicaHiperStores = await getGICAEndStores(yest, "H");
    let gicaNetworkStores = await getGICAEndStores(yest, "N");
    transporter
      .sendMail({
        attachments: [
          {
            filename: "WS.xlsx",
            content: buffer,
          },
        ],
        from: EMAIL,
        to: email,
        subject: "Raport procesu generowania zamówień ESAMBO - automat",
        html: `<p>Witam,<br />
        <br />
${orders_txt}<br />
${mandala_txt}<br />
3. Zestawienie przetworzenia WS - załącznik w formacie xlsx</p>`,
      })
      .then((info: any) => {
        console.log({ info });
      })
      .catch(console.error);

    if (gica !== null) {
      transporter
        .sendMail({
          attachments: [
            {
              filename: "Lista.xlsx",
              content: gica,
            },
          ],
          from: EMAIL,
          to: email,
          subject: "Transfer GICA vs. integracja danych w eSambo - automat",
          text: `Witam,

1. W załączeniu przesyłam listę sklepów, gdzie aktualizacja danych w sklepie zakończyła się po północy.
2. Aktualizacja danych na sklepach sieciowych i franczyzowych zakończyła się: ${gicaNetworkStores}.
3. Aktualizacja na hipermarketach zakończyła się: ${gicaHiperStores}.`,
        })
        .then((info: any) => {
          console.log({ info });
        })
        .catch(console.error);
    } else {
      transporter
        .sendMail({
          from: EMAIL,
          to: email,
          subject: "Transfer GICA vs. integracja danych w eSambo - automat",
          text: `Witam,

1. Aktualizacja danych na sklepach sieciowych i franczyzowych zakończyła się: ${gicaNetworkStores}.
2. Aktualizacja na hipermarketach zakończyła się: ${gicaHiperStores}.`,
        })
        .then((info: any) => {
          console.log({ info });
        })
        .catch(console.error);
    }
    unBlockRaport("morning");
  } catch (e) {
    next(e);
  }
};

const schedule = require("node-schedule");

const automaticMorningReport = schedule.scheduleJob(
  "0 45 5 * * *",
  async () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const day = String(new Date().getDate()).padStart(2, "0");
    const day2 = String(new Date().getDate() - 1).padStart(2, "0");
    let today = `${year}-${month}-${day}`;
    let yest = `${year}-${month}-${day2}`;
    let orders_txt = await getOrders();
    let mandala_txt = await getMandala();
    let buffer = await getWS(today, yest);
    let gica = await getGICA(today, yest);
    let gicaHiperStores = await getGICAEndStores(yest, "H");
    let gicaNetworkStores = await getGICAEndStores(yest, "N");
    transporter
      .sendMail({
        attachments: [
          {
            filename: "WS.xlsx",
            content: buffer,
          },
        ],
        from: EMAIL,
        to: "esambo_hd@asseco.pl",
        subject: "Raport procesu generowania zamówień ESAMBO - automat",
        html: `<p>Witam,<br />
        <br />
${orders_txt}<br />
${mandala_txt}<br />
3. Zestawienie przetworzenia WS - załącznik w formacie xlsx</p>`,
      })
      .then((info: any) => {
        console.log({ info });
      })
      .catch(console.error);

    if (gica !== null) {
      transporter
        .sendMail({
          attachments: [
            {
              filename: "Lista.xlsx",
              content: gica,
            },
          ],
          from: EMAIL,
          to: "esambo_hd@asseco.pl",
          subject: "Transfer GICA vs. integracja danych w eSambo - automat",
          text: `Witam,

1. W załączeniu przesyłam listę sklepów, gdzie aktualizacja danych w sklepie zakończyła się po północy.
2. Aktualizacja danych na sklepach sieciowych i franczyzowych zakończyła się: ${gicaNetworkStores}.
3. Aktualizacja na hipermarketach zakończyła się: ${gicaHiperStores}.`,
        })
        .then((info: any) => {
          console.log({ info });
        })
        .catch(console.error);
    } else {
      transporter
        .sendMail({
          from: EMAIL,
          to: "esambo_hd@asseco.pl",
          subject: "Transfer GICA vs. integracja danych w eSambo - automat",
          text: `Witam,

1. Aktualizacja danych na sklepach sieciowych i franczyzowych zakończyła się: ${gicaNetworkStores}.
2. Aktualizacja na hipermarketach zakończyła się: ${gicaHiperStores}.`,
        })
        .then((info: any) => {
          console.log({ info });
        })
        .catch(console.error);
    }
  }
);

export function formatDate(date: Date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hour = "" + d.getHours(),
    minutes = "" + d.getMinutes(),
    sec = "" + d.getSeconds();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (sec.length < 2) sec = "0" + sec;
  if (minutes.length < 2) minutes = "0" + minutes;
  if (hour.length < 2) hour = "0" + hour;

  var formattedDate =
    day + "." + month + "." + year + " " + hour + ":" + minutes + ":" + sec;
  return formattedDate;
}
