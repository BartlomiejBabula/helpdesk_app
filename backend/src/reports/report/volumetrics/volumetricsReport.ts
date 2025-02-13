import { LogTaskType } from 'src/logger/dto/createLog';
import { LogStatus } from 'src/logger/dto/getLog';
import { LoggerService } from 'src/logger/logger.service';
import { EMAIL, transporter } from 'src/nodemailer';

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let dbUser = process.env.SAMBODB_USER;
let dbPassword = process.env.SAMBODB_PASSWORD;
let dbIP = process.env.SAMBODB_IP;
let dbPort = process.env.SAMBODB_PORT;
let dbSID = process.env.SAMBODB_SID;

let zabbixUser = process.env.ZABBIX_USER;
let zabbixPassword = process.env.ZABBIX_PASSWORD;
let zabbixUrl = process.env.ZABBIX_URL;

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
  let child_process = require('child_process');
  const path = require('path');
  const fs = require('fs');
  await child_process.exec(
    `python3 /usr/src/app/src/reports/report/volumetrics/Raport_wolumetryka.py ${dbUser} ${dbPassword} ${dbIP} ${dbPort} ${dbSID} ${zabbixUrl} ${zabbixUser} ${zabbixPassword}`,
    async function (err: any, stdout: any, stderr: any) {
      if (err) {
        loggerService.createLog({
          taskId: logId,
          task: LogTaskType.VOLUMETRIC_REPORT,
          status: LogStatus.IN_PROGRESS,
          orderedBy: createdBy,
          description: `${err}`,
        });
      }
      await transporter
        .sendMail({
          attachments: [
            {
              filename: `Wolumetryka.xlsx`,
              path: path.join(
                '/usr/src/app/src/reports/report/volumetrics/Wolumetryka.xlsx',
              ),
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
https://wiki.skg.pl/wiki/index.php/Raport_-_Wolumetryka_serwer%C3%B3w</p>`,
        })
        .then((info: any) => {
          fs.existsSync(
            '/usr/src/app/src/reports/report/volumetrics/Wolumetryka.xlsx',
          ) &&
            fs.unlink(
              '/usr/src/app/src/reports/report/volumetrics/Wolumetryka.xlsx',
              (err: any) => {
                if (err) {
                  loggerService.createLog({
                    taskId: logId,
                    task: LogTaskType.VOLUMETRIC_REPORT,
                    status: LogStatus.IN_PROGRESS,
                    orderedBy: createdBy,
                    description: `${err}`,
                  });
                  return;
                }
              },
            );
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
    },
  );
  await loggerService.createLog({
    taskId: logId,
    task: LogTaskType.VOLUMETRIC_REPORT,
    status: LogStatus.DONE,
    orderedBy: createdBy,
  });
}
