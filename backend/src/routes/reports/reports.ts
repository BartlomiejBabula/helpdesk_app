import { Router, Request, Response, NextFunction } from "express";
import { authJWTMiddleware } from "../users";
import { Report } from "../../models/Report";
import { Model } from "sequelize-typescript";
import { generateMorningReport } from "./morningReport";
import { getJobs } from "./jobs";
import { getJobsWithError } from "./jobsError";
import { runSeleniumDEV, runSeleniumTest } from "./seleniumTest";
import { runVolumetrics } from "./volumetrics";
import { TOKEN } from "../../app";
import { getReplication } from "./replication";
import { getJiraSLA } from "./jiraSla";

export const reports = Router();

reports.use("/jobs", authJWTMiddleware, getJobs);
reports.use("/jobs-with-error", authJWTMiddleware, getJobsWithError);
reports.use("/morning", authJWTMiddleware, generateMorningReport);
reports.use("/selenium", authJWTMiddleware, runSeleniumTest);
reports.use("/selenium-dev", authJWTMiddleware, runSeleniumDEV);
reports.use("/volumetrics", authJWTMiddleware, runVolumetrics);
reports.use("/replication", authJWTMiddleware, getReplication);
reports.post("/jira-sla", authJWTMiddleware, getJiraSLA);

reports.get(
  "/blocked",
  authJWTMiddleware,
  async (req: Request, res: Response, next) => {
    try {
      res.json(await Report.findAll({ where: { block: true } }));
    } catch (e) {
      next(e);
    }
  }
);

export const setBlockRaport = async (
  raportName: string,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let newReport = { name: raportName, block: true };
    let reportBlock: boolean = false;
    let reportExist: boolean = false;
    const reportList = await Report.findAll();
    reportList.filter(
      (report) =>
        report.dataValues.name === raportName &&
        report.dataValues.block === true &&
        (reportBlock = true)
    );
    reportList.filter(
      (report) => report.dataValues.name === raportName && (reportExist = true)
    );
    if (reportBlock) {
      res.status(400).json(`Raport blocked!`);
    } else {
      if (reportExist) {
        const report = await Report.update<Report>(
          { block: true },
          {
            where: {
              name: raportName,
            },
          }
        );
        res.status(201).json(report);
      } else {
        const report = await Report.create<Model>(newReport);
        res.status(201).json(report);
      }
    }
  } catch (e) {
    next(e);
  }
};

export const unBlockRaport = async (raportName: string) => {
  Report.update<Report>(
    { block: false },
    {
      where: {
        name: raportName,
      },
    }
  );
};

export const getUserEmail = async (req: Request) => {
  const jwt = require("jsonwebtoken");
  const JWT = jwt.verify(req.headers["authorization"]?.split(" ")[1], TOKEN);
  return JWT.email;
};

async function myInterval() {
  const reportList = await Report.findAll();
  let currentDate = new Date();
  reportList.map((report) => {
    let compareDate = report.dataValues.updatedAt;
    compareDate.setMinutes(compareDate.getMinutes() + 30);
    if (report.dataValues.block === true && currentDate > compareDate) {
      Report.update<Report>(
        { block: false },
        {
          where: {
            name: report.dataValues.name,
          },
        }
      );
    }
  });
}
setInterval(myInterval, 10 * 60000);
