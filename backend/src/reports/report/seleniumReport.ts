import { LogTaskType } from 'src/logger/dto/createLog';
import { LogStatus } from 'src/logger/dto/getLog';
import { LoggerService } from 'src/logger/logger.service';
import { transporter, EMAIL } from 'src/nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';

const getFilesInFolder = async (folderPath: string) => {
  try {
    return fs
      .readdirSync(folderPath)
      .filter((file) => fs.statSync(path.join(folderPath, file)).isFile())
      .map((file) => ({
        filename: file,
        path: path.join(folderPath, file),
      }));
  } catch (error) {
    console.error(`Playwright getFilesInFolder: ${error.message}`);
    return [];
  }
};

const createZip = async (zipPath: string, folder: string) => {
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });
  archive.on('error', (err) => {
    console.error(`Error ZIP: ${err.message}`);
    throw err;
  });

  output.on('close', () => {});

  archive.pipe(output);

  archive.file(path.join(folder, 'index.html'), { name: 'index.html' });

  const filesInDataFolder = await getFilesInFolder(path.join(folder, 'data'));
  for (const file of filesInDataFolder) {
    if (file.filename.endsWith('.png')) {
      archive.file(file.path, { name: path.join('data', file.filename) });
    }
  }
  await archive.finalize();
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

  let child_process = require('child_process');
  await child_process.exec(
    `cd playwright && npx playwright test`,
    async function (err: any, stdout: any, stderr: any) {
      const folderPath = '/usr/src/app/playwright/test-results/report';
      const zipPath = path.join(folderPath, 'report.zip');
      await createZip(zipPath, folderPath);
      transporter
        .sendMail({
          attachments: [
            {
              filename: 'report.zip',
              path: zipPath,
            },
          ],
          from: EMAIL,
          to: email,
          subject: `Selenium`,
          html: `<p>Cześć,</br>
w załączniku przesyłam raport z wykonania testów selenium</p>`,
        })
        .then((info: any) => {
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
