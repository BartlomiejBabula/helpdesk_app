import axios from 'axios';
import { EMAIL, transporter } from 'src/nodemailer';
import xlsx from 'node-xlsx';
import { LoggerService } from 'src/logger/logger.service';
import { LogTaskType } from 'src/logger/dto/createLog';
import { LogStatus } from 'src/logger/dto/getLog';

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

interface JiraUserType {
  name: string;
  value: string;
}

export async function generateSLARaport(
  req: any,
  email: string,
  loggerService: LoggerService,
  createdBy: string,
) {
  const logId = await loggerService.createLog({
    task: LogTaskType.SLA_REPORT,
    status: LogStatus.OPEN,
    orderedBy: createdBy,
  });
  if (req.body.issue !== undefined) {
    const JIRA_USER = process.env.JIRA_USER;
    const JIRA_PASSWORD = process.env.JIRA_PASSWORD;
    let axiosError = '';
    await axios
      .post('https://jira.skg.pl/rest/auth/1/session', {
        username: JIRA_USER,
        password: JIRA_PASSWORD,
      })
      .then(async (res: any) => {
        const jiraUser: JiraUserType = {
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
            if (response.data.fields.subtasks.length > 0) {
              await createSLAreports(
                response.data.fields.subtasks,
                jiraUser,
                req.body.exceptionsDates,
                req.body.type,
                email,
                logId,
                loggerService,
                createdBy,
              );
            } else {
              axiosError = 'The issue does not have subtasks';
            }
          })
          .catch((error: Error) => {
            axiosError = `The issue does not exist in jira`;
          });
      });
    if (axiosError !== '') {
      loggerService.createLog({
        taskId: logId,
        task: LogTaskType.SLA_REPORT,
        status: LogStatus.IN_PROGRESS,
        orderedBy: createdBy,
        description: axiosError,
      });
    }
  } else {
    loggerService.createLog({
      taskId: logId,
      task: LogTaskType.SLA_REPORT,
      status: LogStatus.IN_PROGRESS,
      orderedBy: createdBy,
      description: 'Error',
    });
  }
  loggerService.createLog({
    taskId: logId,
    task: LogTaskType.SLA_REPORT,
    status: LogStatus.DONE,
    orderedBy: createdBy,
  });
}

const createSLAreports = async (
  tasks: any,
  jiraUser: JiraUserType,
  exceptionsDates: string[] | Date[],
  type: 'esambo' | 'qlik',
  email: string,
  logId: string,
  loggerService: LoggerService,
  createdBy: string,
) => {
  let newExceptionsDates = exceptionsDates.map((item) => new Date(item));
  let parentKey = '';
  let SLA_data = [
    [
      {
        v: 'CHILDKEY',
      },
      {
        v: 'SU_SD',
      },
      {
        v: 'DATA_ROZPOCZECIA',
      },
      {
        v: 'DATA_ZAMKNIECIA',
      },
      {
        v: 'CZAS_ROZWIAZYWANIA_HHH_MM',
      },
      {
        v: 'WAGA',
      },
      {
        v: 'SLA',
      },
      {
        v: 'KOMENTARZ',
      },
    ],
  ];
  let SLA_NOT_OK = [
    [
      {
        v: 'CHILDKEY',
      },
      {
        v: 'SU_SD',
      },
      {
        v: 'DATA_ROZPOCZECIA',
      },
      {
        v: 'DATA_ZAMKNIECIA',
      },
      {
        v: 'CZAS_ROZWIAZYWANIA_HHH_MM',
      },
      {
        v: 'WAGA',
      },
      {
        v: 'SLA',
      },
      {
        v: 'KOMENTARZ',
      },
    ],
  ];
  let SLA_NOT_CLOSE = [
    [
      {
        v: 'CHILDKEY',
      },
      {
        v: 'SU_SD',
      },
      {
        v: 'DATA_ROZPOCZECIA',
      },
      {
        v: 'DATA_OSTATNIEJ_OPERACJI ',
      },
      {
        v: 'CZAS_ROZWIAZYWANIA_HHH_MM',
      },
      {
        v: 'OSTATNI_STATUS',
      },
      {
        v: 'WAGA',
      },
      {
        v: 'SLA',
      },
      {
        v: 'KOMENTARZ',
      },
    ],
  ];
  let SLA_OPEN = [
    [
      {
        v: 'CHILDKEY',
      },
      {
        v: 'SU_SD',
      },
      {
        v: 'DATA_ROZPOCZECIA',
      },
      {
        v: 'DATA_OSTATNIEJ_OPERACJI ',
      },
      {
        v: 'CZAS_ROZWIAZYWANIA_HHH_MM',
      },
      {
        v: 'OSTATNI_STATUS',
      },
      {
        v: 'WAGA',
      },
      {
        v: 'SLA',
      },
      {
        v: 'KOMENTARZ',
      },
      {
        v: 'ZGLOSZENIE_DO',
      },
    ],
  ];
  let SLA_ALL = [
    [
      {
        v: 'PROC_SLA',
      },
      {
        v: 'ILE_ZGLOSZEN OK',
      },
      {
        v: 'ZGLOSZEN_OGOLEM',
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
        },
      )
      .then((response: any) => {
        if (key === 0) parentKey = response.data.fields.parent.key;
        let startDate = new Date(response.data.fields.created);

        let closeDate: Date | null = new Date(
          response.data.fields.resolutiondate,
        );
        let SLATime = 0;
        let formatTime = '';
        let priority = '';
        let SLA_OK = 'OK';
        if (response.data.fields.resolutiondate !== null) {
          closeDate = new Date(response.data.fields.resolutiondate);
        } else {
          closeDate = null;
        }
        SLATime = getSLAtime(
          response.data.changelog.histories,
          newExceptionsDates,
          type,
        );
        formatTime = formatTimeToPrint(SLATime);
        if (type === 'qlik') {
          if (response.data.fields.priority.name === 'Drobny') {
            priority = 'D';
            if (SLATime > 129600000) {
              SLA_OK = 'NOT OK';
            }
          }
          if (response.data.fields.priority.name === 'Średni') {
            priority = 'C';
            if (SLATime > 64800000) {
              SLA_OK = 'NOT OK';
            }
          }
          if (response.data.fields.priority.name === 'Poważny') {
            priority = 'B';
            if (SLATime > 32400000) {
              SLA_OK = 'NOT OK';
            }
          }
          if (
            response.data.fields.priority.name === 'Krytyczny' ||
            response.data.fields.priority.name === 'Blokujący'
          ) {
            priority = 'A';
            if (SLATime > 14400000) {
              SLA_OK = 'NOT OK';
            }
          }
        }
        if (type === 'esambo') {
          if (response.data.fields.priority.name === 'Drobny') {
            priority = 'C';
            if (SLATime > 172800000) {
              SLA_OK = 'NOT OK';
            }
          }
          if (
            response.data.fields.priority.name === 'Średni' ||
            response.data.fields.priority.name === 'Poważny'
          ) {
            priority = 'B';
            if (SLATime > 21600000) {
              SLA_OK = 'NOT OK';
            }
          }
          if (
            response.data.fields.priority.name === 'Krytyczny' ||
            response.data.fields.priority.name === 'Blokujący'
          ) {
            priority = 'A';
            if (SLATime > 14400000) {
              SLA_OK = 'NOT OK';
            }
          }
        }
        if (closeDate === null) {
          let lastUpdatedStatusesDate = getLastDateStatusChange(
            response.data.changelog.histories,
          );
          let newRow = [
            task.key,
            response.data.fields.summary.slice(0, 9),
            startDate,
            lastUpdatedStatusesDate,
            formatTime,
            response.data.fields.status.name,
            priority,
            SLA_OK,
            '',
          ];
          if (
            response.data.fields.status.id === '1' ||
            response.data.fields.status.id === '3' ||
            response.data.fields.status.id === '4'
          ) {
            let reopenedDate = getReopenedDate(
              response.data.changelog.histories,
              response.data.fields.status.id,
            );
            let timeTillOK = calculateOpenSLA(
              reopenedDate,
              newExceptionsDates,
              priority,
              SLATime,
              type,
            );
            newRow.push(timeTillOK);
            return (SLA_OPEN = [...SLA_OPEN, newRow]);
          } else SLA_NOT_CLOSE = [...SLA_NOT_CLOSE, newRow];
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
          if (SLA_OK === 'NOT OK')
            return (SLA_NOT_OK = [...SLA_NOT_OK, newRow]);
          else return (SLA_data = [...SLA_data, newRow]);
        }
      });
  });
  await Promise.all(promis);
  let issueOK = SLA_data.length - 1;
  let issueAll = issueOK + SLA_NOT_OK.length - 1;
  let percentageOK = ((issueOK / issueAll) * 100).toFixed(0);
  SLA_ALL = [
    ...SLA_ALL,
    [
      { v: percentageOK },
      { v: issueOK.toString() },
      { v: issueAll.toString() },
    ],
  ];
  let buffer = xlsx.build(
    [
      {
        name: '_1_SLA',
        data: SLA_ALL,
        options: {
          '!cols': [{ width: 14 }, { width: 18 }, { width: 18 }],
        },
      },
      {
        name: '_2_Zadania_Zamkniete_OK',
        data: SLA_data,
        options: {
          '!cols': [
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
        name: '_3_Zadania_Zamkniete_NOT_OK',
        data: SLA_NOT_OK,
        options: {
          '!cols': [
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
        name: '_4_Zadania_Niezamkniete',
        data: SLA_NOT_CLOSE,
        options: {
          '!cols': [
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
        name: '_5_Zadania_Otwarte',
        data: SLA_OPEN,
        options: {
          '!cols': [
            { width: 10 },
            { width: 10 },
            { width: 18 },
            { width: 24 },
            { width: 32 },
            { width: 24 },
            { width: 10 },
            { width: 10 },
            { width: 32 },
            { width: 32 },
          ],
        },
      },
    ],
    { parseOptions: { cellStyles: true }, writeOptions: { cellStyles: true } },
  );
  await transporter
    .sendMail({
      attachments: [
        {
          filename: parentKey + '_SLA.xlsx',
          content: buffer,
        },
      ],
      from: EMAIL,
      to: email,
      subject: 'Raport JIRA SLA',
      html: `<p>Witam,<br />
        <br />
    W załączniku przesyłam raport JIRA SLA.</p>`,
    })
    .then((info: any) => {
      loggerService.createLog({
        taskId: logId,
        task: LogTaskType.SLA_REPORT,
        status: LogStatus.IN_PROGRESS,
        orderedBy: createdBy,
        description: `Email sent`,
      });
    })
    .catch((error) => {
      loggerService.createLog({
        taskId: logId,
        task: LogTaskType.SLA_REPORT,
        status: LogStatus.IN_PROGRESS,
        orderedBy: createdBy,
        description: `${error}`,
      });
    });
};

function formatTimeToPrint(ms: number) {
  let d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  h += d * 24;
  h = '' + h;
  m = '' + m;

  if (h.length === 1) h = '00' + h;
  if (h.length === 2) h = '0' + h;
  if (m.length < 2) m = '0' + m;

  return h + ':' + m;
}

function getSLAtime(
  changelogs: any,
  exceptionDates: Date[],
  type: 'esambo' | 'qlik',
) {
  let startDate: Date = new Date(0);
  let endDate: Date = new Date(0);
  let slaTime = 0;
  changelogs.map((change: any, key: number) => {
    let item = change.items.filter((item: any) => item.field === 'status');
    if (key === 0) startDate = new Date(change.created);
    if (item.length >= 1) {
      if (
        (item[0].to === '6' ||
          item[0].to === '10003' ||
          item[0].to === '10002') &&
        endDate < new Date(change.created)
      ) {
        endDate = new Date(change.created);
        slaTime =
          slaTime + calculateSLA(startDate, endDate, exceptionDates, type);
      }
      if (
        (item[0].to === '3' || item[0].to === '4') &&
        endDate < new Date(change.created) &&
        startDate < endDate
      ) {
        startDate = new Date(change.created);
      }
    }
  });
  return slaTime;
}

function calculateSLA(
  startDate: Date,
  endDate: Date,
  exceptionDates: Date[],
  type: 'esambo' | 'qlik',
) {
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
      if (type === 'qlik') {
        if (
          newDate.getHours() >= 6 &&
          newDate.getHours() < 18 &&
          newDate.getDay() !== 0 &&
          newDate.getDay() !== 6
        ) {
          slaTime++;
        }
      }
      if (type === 'esambo') {
        if (newDate.getHours() >= 6 && newDate.getHours() < 22) {
          slaTime++;
        }
      }
    }
    currentDate = newDate;
  }
  let slaTimeMS = slaTime * 60000;
  return slaTimeMS;
}

function calculateOpenSLA(
  startDate: Date,
  exceptionDates: Date[],
  priority: string,
  slaMS: number,
  type: 'esambo' | 'qlik',
) {
  let currentDate = startDate;
  let slaTime = 0;
  let maxTimeMS = 0;
  if (type === 'qlik') {
    if (priority === 'A') {
      maxTimeMS = 14400000;
    }
    if (priority === 'B') {
      maxTimeMS = 32400000;
    }
    if (priority === 'C') {
      maxTimeMS = 64800000;
    }
    if (priority === 'D') {
      maxTimeMS = 129600000;
    }
  }
  if (type === 'esambo') {
    if (priority === 'A') {
      maxTimeMS = 14400000;
    }
    if (priority === 'B') {
      maxTimeMS = 21600000;
    }
    if (priority === 'C') {
      maxTimeMS = 172800000;
    }
  }

  for (let i = 1; slaTime * 60000 + slaMS <= maxTimeMS; i++) {
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
      if (type === 'qlik') {
        if (
          newDate.getHours() >= 6 &&
          newDate.getHours() < 18 &&
          newDate.getDay() !== 0 &&
          newDate.getDay() !== 6
        ) {
          slaTime++;
        }
      }
      if (type === 'esambo') {
        if (newDate.getHours() >= 6 && newDate.getHours() < 22) {
          slaTime++;
        }
      }
    }
    currentDate = newDate;
  }
  return currentDate;
}

function getLastDateStatusChange(changelogs: any) {
  let lastDateChangeStatus: Date = new Date(0);
  changelogs.map((change: any) => {
    let item = change.items.filter((item: any) => item.field === 'status');
    if (item.length >= 1) {
      if (item[0].field === 'status') {
        lastDateChangeStatus = new Date(change.created);
      }
    }
  });
  return lastDateChangeStatus;
}

function getReopenedDate(changelogs: any, actualStatus: string) {
  let reopenedDate: Date = new Date(0);
  changelogs.map((change: any) => {
    let item = change.items.filter((item: any) => item.field === 'status');
    if (item.length >= 1) {
      if (item[0].to === actualStatus) {
        reopenedDate = new Date(change.created);
      }
    }
  });
  return reopenedDate;
}
