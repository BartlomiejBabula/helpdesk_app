import { NextFunction, Request, Response } from "express";
import { setBlockRaport, getUserEmail, unBlockRaport } from "./reports";
import { transporter, EMAIL } from "../../config/nodemailer";
import {
  SAMBO_DEV_IP,
  SAMBO_TEST_IP,
  SELENIUM_USER,
  SELENIUM_PASSWORD,
  FRANCHISE_STORE,
} from "../../app";

const deleteFiles = () => {
  const fs = require("fs");
  const files = [
    "/usr/src/app/src/selenium/tests/report.html",
    "/usr/src/app/src/selenium/tests/log.html",
    // "/usr/src/app/src/selenium/tests/geckodriver-1.log",
    // "/usr/src/app/src/selenium/tests/selenium-screenshot-1.png",
    "/usr/src/app/src/selenium/tests/output.xml",
  ];
  files.forEach(
    (path) =>
      fs.existsSync(path) &&
      fs.unlink(path, (err: any) => {
        if (err) {
          console.error(err);
          return;
        }
      })
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

const runSelenium = async (
  environment: "TEST" | "DEV",
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let envIP: string | undefined;
  let blockRep = "";
  if (environment === "TEST") {
    envIP = SAMBO_TEST_IP;
    blockRep = "selenium";
  } else if (environment === "DEV") {
    envIP = SAMBO_DEV_IP;
    blockRep = "selenium_dev";
  }
  const email = await getUserEmail(req);
  setBlockRaport(blockRep, req, res, next);
  const path = require("path");
  let child_process = require("child_process");
  child_process.exec(
    `cd src/selenium/tests && robot --variable SERVER:${envIP} --variable BROWSER:headlessfirefox --variable VALID_USER:${SELENIUM_USER} --variable VALID_PASSWORD:${SELENIUM_PASSWORD} --variable FRANCHISE_STORE:${FRANCHISE_STORE} .`,

    function (err: any, stdout: any, stderr: any) {
      if (err) {
        console.log("child processes failed with error code: " + err);
      }
      transporter
        .sendMail({
          attachments: [
            {
              filename: `report.html`,
              path: path.join("/usr/src/app/src/selenium/tests/report.html"),
            },
            {
              filename: `log.html`,
              path: path.join("/usr/src/app/src/selenium/tests/log.html"),
            },
          ],
          from: EMAIL,
          to: email,
          subject: `Selenium środowisko ${environment}`,
          text: "There is a new article. It's about sending emails, check it out!",
          html: `<p>Cześć,</p>
                <p>w załączniku przesyłam raport z wykonania testów selenium</p>`,
        })
        .then((info: any) => {
          console.log("Message was sent");
          deleteFiles();
          unBlockRaport(blockRep);
        })
        .catch(console.error);
    }
  );
};

export const runSeleniumTest = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    runSelenium("TEST", req, res, next);
  } catch (e) {
    next(e);
  }
};

export const runSeleniumDEV = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    runSelenium("DEV", req, res, next);
  } catch (e) {
    next(e);
  }
};
