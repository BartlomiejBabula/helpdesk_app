import { LogTaskType } from 'src/logger/dto/createLog';
import { LogStatus } from 'src/logger/dto/getLog';
import { LoggerService } from 'src/logger/logger.service';
import { transporter, EMAIL } from 'src/nodemailer';

const SAMBO_TEST_IP = process.env.SAMBO_TEST_IP;
const SELENIUM_USER = process.env.SELENIUM_USER;
const SELENIUM_PASSWORD = process.env.SELENIUM_PASSWORD;
const FRANCHISE_STORE = process.env.FRANCHISE_STORE;

const deleteFiles = () => {
  const fs = require('fs');
  const files = [
    '/usr/src/app/src/selenium/tests/report.html',
    '/usr/src/app/src/selenium/tests/log.html',
    // "/usr/src/app/src/selenium/tests/geckodriver-1.log",
    // "/usr/src/app/src/selenium/tests/selenium-screenshot-1.png",
    '/usr/src/app/src/selenium/tests/output.xml',
  ];
  files.forEach(
    (path) =>
      fs.existsSync(path) &&
      fs.unlink(path, (err: any) => {
        if (err) {
          console.error(err);
          return;
        }
      }),
  );
  for (let i = 1; i < 100; i++) {
    let deleteGecko = `/usr/src/app/src/selenium/tests/geckodriver-${i}.log`;
    if (fs.existsSync(deleteGecko)) {
      fs.unlink(deleteGecko, (err: any) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } else break;
  }
  for (let i = 1; i < 200; i++) {
    let deleteScreenshot = `/usr/src/app/src/selenium/tests/selenium-screenshot-${i}.png`;
    if (fs.existsSync(deleteScreenshot)) {
      fs.unlink(deleteScreenshot, (err: any) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } else break;
  }
};

export async function generateSelenium(
  email: string,
  loggerService: LoggerService,
  createdBy: string,
) {
  const logId = await loggerService.createLog({
    task: LogTaskType.SELENIUM_REPORT,
    status: LogStatus.OPEN,
    orderedBy: createdBy,
  });
  let envIP = SAMBO_TEST_IP;
  const path = require('path');
  let child_process = require('child_process');
  await child_process.exec(
    `cd src/selenium/tests && robot --variable SERVER:${envIP} --variable BROWSER:headlessfirefox --variable VALID_USER:${SELENIUM_USER} --variable VALID_PASSWORD:${SELENIUM_PASSWORD} --variable FRANCHISE_STORE:${FRANCHISE_STORE} .`,
    function (err: any, stdout: any, stderr: any) {
      if (err) {
        loggerService.createLog({
          taskId: logId,
          task: LogTaskType.SELENIUM_REPORT,
          status: LogStatus.IN_PROGRESS,
          orderedBy: createdBy,
          description: `${err}`,
        });
      }
      transporter
        .sendMail({
          attachments: [
            {
              filename: `report.html`,
              path: path.join('/usr/src/app/src/selenium/tests/report.html'),
            },
            {
              filename: `log.html`,
              path: path.join('/usr/src/app/src/selenium/tests/log.html'),
            },
          ],
          from: EMAIL,
          to: email,
          subject: `Selenium środowisko TEST`,
          html: `<p>Cześć,</br>
w załączniku przesyłam raport z wykonania testów selenium</p>`,
        })
        .then((info: any) => {
          deleteFiles();
          loggerService.createLog({
            taskId: logId,
            task: LogTaskType.SELENIUM_REPORT,
            status: LogStatus.IN_PROGRESS,
            orderedBy: createdBy,
            description: `Email sent`,
          });
        })
        .catch((err) => {
          loggerService.createLog({
            taskId: logId,
            task: LogTaskType.SELENIUM_REPORT,
            status: LogStatus.IN_PROGRESS,
            orderedBy: createdBy,
            description: `${err}`,
          });
        });
    },
  );
  loggerService.createLog({
    taskId: logId,
    task: LogTaskType.SELENIUM_REPORT,
    status: LogStatus.DONE,
    orderedBy: createdBy,
  });
}
