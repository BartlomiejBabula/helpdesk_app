import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { EMAIL, transporter } from "../../config/nodemailer";
import xlsx from "node-xlsx";
import { getUserEmail } from "./reports";

const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export const getJiraSLA = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.issue !== undefined) {
      const JIRA_USER = process.env.JIRA_USER;
      const JIRA_PASSWORD = process.env.JIRA_PASSWORD;
      let axiosError = "";
      await axios
        .post("https://jira.skg.pl/rest/auth/1/session", {
          username: JIRA_USER,
          password: JIRA_PASSWORD,
        })
        .then(async (res: any) => {
          let jiraUser: { name: string; value: string } = {
            name: res.data.session.name,
            value: res.data.session.value,
          };
          await axios
            .get(`https://jira.skg.pl/rest/api/2/issue/${req.body.issue}`, {
              headers: {
                Cookie: `${jiraUser.name}=${jiraUser.value}`,
              },
            })
            .then(async (response: any) => {
              if (response.data.fields.subtasks.length > 0)
                await createJiraSLAreports(
                  req,
                  response.data.fields.subtasks,
                  jiraUser,
                  req.body.exceptionsDates
                );
              else {
                axiosError = "The issue does not have subtasks";
              }
            })
            .catch((error: Error) => {
              axiosError = `The issue does not exist in jira`;
            });
        });
      if (axiosError !== "") res.status(400).json(axiosError);
      else res.status(201).json("Report sent");
    } else {
      res.status(400).json(`Bad request`);
    }
  } catch (e) {
    next(e);
  }
};

const createJiraSLAreports = async (
  req: Request,
  tasks: any,
  jiraUser: any,
  exceptionsDates: any[]
) => {
  exceptionsDates = exceptionsDates.map((item) => new Date(item));
  let parentKey = "";
  let SLA_data: any = [
    [
      {
        v: "CHILDKEY",
      },
      {
        v: "SU_SD",
      },
      {
        v: "DATA_ROZPOCZECIA",
      },
      {
        v: "DATA_ZAMKNIECIA",
      },
      {
        v: "CZAS_ROZWIAZYWANIA_HHH_MM",
      },
      {
        v: "WAGA",
      },
      {
        v: "SLA",
      },
      {
        v: "KOMENTARZ",
      },
    ],
  ];
  let SLA_NOT_OK: any = [
    [
      {
        v: "CHILDKEY",
      },
      {
        v: "SU_SD",
      },
      {
        v: "DATA_ROZPOCZECIA",
      },
      {
        v: "DATA_ZAMKNIECIA",
      },
      {
        v: "CZAS_ROZWIAZYWANIA_HHH_MM",
      },
      {
        v: "WAGA",
      },
      {
        v: "SLA",
      },
      {
        v: "KOMENTARZ",
      },
    ],
  ];
  let SLA_NOT_CLOSE: any = [
    [
      {
        v: "CHILDKEY",
      },
      {
        v: "SU_SD",
      },
      {
        v: "DATA_ROZPOCZECIA",
      },
      {
        v: "DATA_OSTATNIEJ_OPERACJI ",
      },
      {
        v: "CZAS_ROZWIAZYWANIA_HHH_MM",
      },
      {
        v: "OSTATNI_STATUS",
      },
      {
        v: "WAGA",
      },
      {
        v: "SLA",
      },
      {
        v: "KOMENTARZ",
      },
    ],
  ];
  let SLA_OPEN: any = [
    [
      {
        v: "CHILDKEY",
      },
      {
        v: "SU_SD",
      },
      {
        v: "DATA_ROZPOCZECIA",
      },
      {
        v: "DATA_OSTATNIEJ_OPERACJI ",
      },
      {
        v: "CZAS_ROZWIAZYWANIA_HHH_MM",
      },
      {
        v: "OSTATNI_STATUS",
      },
      {
        v: "WAGA",
      },
      {
        v: "SLA",
      },
      {
        v: "KOMENTARZ",
      },
    ],
  ];
  let SLA_ALL: any = [
    [
      {
        v: "PROC_SLA",
      },
      {
        v: "ILE_ZGLOSZEN OK",
      },
      {
        v: "ZGLOSZEN_OGOLEM",
      },
    ],
  ];
  const promis = tasks.map(async (task: any, key: number) => {
    await axios
      .get(
        `https://jira.skg.pl/rest/api/2/issue/${task.key}?expand=changelog`,
        {
          headers: {
            Cookie: `${jiraUser.name}=${jiraUser.value}`,
          },
        }
      )
      .then((response: any) => {
        if (key === 0) parentKey = response.data.fields.parent.key;
        let startDate = new Date(response.data.fields.created);
        let updatedDate = new Date(response.data.fields.updated);
        let closeDate: Date | null = new Date(
          response.data.fields.resolutiondate
        );
        let SLATime = 0;
        let formatTime = "";
        let priority = "";
        let SLA_OK = "OK";
        if (response.data.fields.resolutiondate !== null) {
          closeDate = new Date(response.data.fields.resolutiondate);
        } else {
          closeDate = null;
        }
        SLATime = getSLAtime(
          response.data.changelog.histories,
          exceptionsDates
        );
        formatTime = convertMS(SLATime);
        if (response.data.fields.priority.name === "Drobny") {
          priority = "C"; //48h
          if (SLATime > 172800000) {
            SLA_OK = "NOT OK";
          }
        }
        if (
          response.data.fields.priority.name === "Średni" ||
          response.data.fields.priority.name === "Poważny"
        ) {
          priority = "B"; // 6h
          if (SLATime > 21600000) {
            SLA_OK = "NOT OK";
          }
        }
        if (
          response.data.fields.priority.name === "Krytyczny" ||
          response.data.fields.priority.name === "Blokujący"
        ) {
          priority = "A"; // 4h
          if (SLATime > 14400000) {
            SLA_OK = "NOT OK";
          }
        }

        if (closeDate === null) {
          let newRow = [
            task.key,
            response.data.fields.summary.slice(0, 9),
            startDate,
            updatedDate,
            formatTime,
            response.data.fields.status.name,
            priority,
            SLA_OK,
          ];
          if (
            response.data.fields.status.id === "1" ||
            response.data.fields.status.id === "3" ||
            response.data.fields.status.id === "4"
          )
            return (SLA_OPEN = [...SLA_OPEN, newRow]);
          else SLA_NOT_CLOSE = [...SLA_NOT_CLOSE, newRow];
        } else {
          let newRow = [
            task.key,
            response.data.fields.summary.slice(0, 9),
            startDate,
            closeDate,
            formatTime,
            priority,
            SLA_OK,
          ];
          if (SLA_OK === "NOT OK")
            return (SLA_NOT_OK = [...SLA_NOT_OK, newRow]);
          else return (SLA_data = [...SLA_data, newRow]);
        }
      });
  });
  await Promise.all(promis);
  let issueOK = SLA_data.length - 1;
  let issueAll = issueOK + SLA_NOT_OK.length - 1;
  let percentageOK = ((issueOK / issueAll) * 100).toFixed(0);
  SLA_ALL = [...SLA_ALL, [percentageOK, issueOK, issueAll]];
  const email = await getUserEmail(req);
  let buffer = xlsx.build(
    [
      {
        name: "_1_SLA",
        data: SLA_ALL,
        options: {
          "!cols": [{ width: 14 }, { width: 18 }, { width: 18 }],
        },
      },
      {
        name: "_2_Zadania_Zamkniete_OK",
        data: SLA_data,
        options: {
          "!cols": [
            { width: 10 },
            { width: 10 },
            { width: 18 },
            { width: 18 },
            { width: 32 },
            { width: 10 },
            { width: 10 },
            { width: 32 },
          ],
        },
      },
      {
        name: "_3_Zadania_Zamkniete_NOT_OK",
        data: SLA_NOT_OK,
        options: {
          "!cols": [
            { width: 10 },
            { width: 10 },
            { width: 18 },
            { width: 18 },
            { width: 32 },
            { width: 10 },
            { width: 10 },
            { width: 32 },
          ],
        },
      },
      {
        name: "_4_Zadania_Niezamkniete",
        data: SLA_NOT_CLOSE,
        options: {
          "!cols": [
            { width: 10 },
            { width: 10 },
            { width: 18 },
            { width: 24 },
            { width: 32 },
            { width: 24 },
            { width: 10 },
            { width: 10 },
            { width: 32 },
          ],
        },
      },
      {
        name: "_5_Zadania_Otwarte",
        data: SLA_OPEN,
        options: {
          "!cols": [
            { width: 10 },
            { width: 10 },
            { width: 18 },
            { width: 24 },
            { width: 32 },
            { width: 24 },
            { width: 10 },
            { width: 10 },
            { width: 32 },
          ],
        },
      },
    ],
    { parseOptions: { cellStyles: true }, writeOptions: { cellStyles: true } }
  );
  transporter
    .sendMail({
      attachments: [
        {
          filename: parentKey + "_SLA.xlsx",
          content: buffer,
        },
      ],
      from: EMAIL,
      to: email,
      subject: "Raport JIRA SLA",
      html: `<p>Witam,<br />
      <br />
  W załączniku przesyłam raport JIRA SLA.</p>`,
    })
    .then((info: any) => {
      console.log({ info });
    })
    .catch(console.error);
};

function convertMS(ms: number) {
  let d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  h += d * 24;
  h = "" + h;
  m = "" + m;

  if (h.length === 1) h = "00" + h;
  if (h.length === 2) h = "0" + h;
  if (m.length < 2) m = "0" + m;

  return h + ":" + m;
}

function getSLAtime(changelogs: any, exceptionDates: Date[]) {
  let startDate: Date = new Date(0);
  let endDate: Date = new Date(0);
  let slaTime = 0;
  changelogs.map((change: any, key: number) => {
    let item = change.items.filter((item: any) => item.field === "status");
    if (key === 0) startDate = new Date(change.created);
    if (item.length >= 1) {
      if (
        (item[0].to === "6" ||
          item[0].to === "10003" ||
          item[0].to === "10002") &&
        endDate < new Date(change.created)
      ) {
        endDate = new Date(change.created);
        slaTime = slaTime + calculateSLA(startDate, endDate, exceptionDates);
      }
      if (
        (item[0].to === "3" || item[0].to === "4") &&
        endDate < new Date(change.created) &&
        startDate < endDate
      ) {
        startDate = new Date(change.created);
      }
    }
  });
  return slaTime;
}

function calculateSLA(startDate: any, endDate: any, exceptionDates: Date[]) {
  let currentDate = startDate;
  let slaTime = 0;
  for (let i = 1; currentDate.getTime() <= endDate.getTime(); i++) {
    let exception = false;
    exceptionDates.forEach((data) => {
      let compareDate = new Date(currentDate);
      compareDate.setUTCHours(0, 0, 0, 0);
      if (data.getTime() === compareDate.getTime()) {
        exception = true;
      } else {
        exception = false;
      }
    });
    let newDate = new Date(currentDate);
    newDate.setMinutes(newDate.getMinutes() + 1);
    if (exception === false) {
      if (newDate.getHours() >= 6 && newDate.getHours() < 22) {
        slaTime++;
      }
    }
    currentDate = newDate;
  }
  let slaTimeMS = slaTime * 60000;
  return slaTimeMS;
}
