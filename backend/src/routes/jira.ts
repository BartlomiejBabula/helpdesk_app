import { Router, Request, Response, NextFunction } from "express";
import { Jira } from "../models/Jira";
import { authJWTMiddleware } from "./users";
import { Model } from "sequelize-typescript";
import axios from "axios";
import { configImap } from "../config/nodemailer";
export const jira = Router();

jira.get(
  "/",
  authJWTMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await Jira.findAll());
    } catch (e) {
      next(e);
    }
  }
);

jira.post(
  "/",
  authJWTMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newJira = req.body;
      if (
        typeof newJira.auto == "boolean" &&
        typeof newJira.jiraKey == "string"
      ) {
        let jiraExist = await Jira.findAll();
        if (jiraExist.length === 0) {
          await Jira.create<Model>(newJira);
          res.status(201).json(newJira);
        } else {
          Jira.update<Jira>(
            { jiraKey: newJira.jiraKey, auto: newJira.auto },
            {
              where: {
                id: jiraExist[0].id,
              },
            }
          );
          res.status(201).json(newJira);
        }
      } else {
        res.status(400).json(`Bad request`);
      }
    } catch (e) {
      next(e);
    }
  }
);

let lastuid: number = 1;
async function myInterval() {
  const JIRA_USER = process.env.JIRA_USER;
  const JIRA_PASSWORD = process.env.JIRA_PASSWORD;

  const jira = await Jira.findAll();
  if (jira[0].auto === true) {
    const simpleParser = require("mailparser").simpleParser;
    const imaps = require("imap-simple");
    const _ = require("lodash");
    let date: Date | string = new Date();
    date.setTime(Date.now());
    date = date.toISOString();
    imaps
      .connect(configImap)
      .then((connection: any) => {
        return connection.openBox("INBOX").then(() => {
          let searchCriteria = [
            ["SINCE", date],
            "UNSEEN",
            ["FROM", "optimus@carrefour.com"],
            ["UID", `${lastuid + 1}:*`],
          ];
          let fetchOptions = {
            bodies: ["HEADER", "TEXT", ""],
            markSeen: true,
          };
          return connection
            .search(searchCriteria, fetchOptions)
            .then((messages: any) => {
              messages.forEach((item: any) => {
                let all = _.find(item.parts, { which: "" });
                let id = item.attributes.uid;
                let idHeader = "Imap-Id: " + id + "\r\n";
                simpleParser(idHeader + all.body, (err: Error, mail: any) => {
                  let body = mail.html;
                  body = body
                    .replace(/\n/gi, "")
                    .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/gi, "")
                    .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/gi, "")
                    .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gi, "")
                    .replace(/<\/\s*(?:p|div)>/gi, "\n")
                    .replace(/<br[^>]*\/?>/gi, "\n")
                    .replace(/<[^>]*>/gi, "")
                    .replace("&nbsp;", " ")
                    .replace(/[^\S\r\n][^\S\r\n]+/gi, " ");

                  if (mail.subject.includes("SD-")) {
                    lastuid = id;
                    let startIndex = mail.subject.indexOf("(SD-");
                    let key = mail.subject.slice(
                      startIndex + 1,
                      startIndex + 10
                    );
                    let startI = body.indexOf("Temat zgłoszenia:");
                    let endI = body.indexOf("Numer zgłoszenia zewnętrznego:");
                    let topic = body.slice(startI, endI);
                    let startT = topic.indexOf("(");
                    if (startT !== -1) {
                      let endT = topic.indexOf(")");
                      topic = topic.slice(startT + 1, endT);
                    }
                    let startS = body.indexOf("Numer bo:") + 10;
                    let store = body.slice(startS, startS + 3);
                    console.log(
                      `Przetwarzam mail: ${key} : ${store} : ${topic}`
                    );
                    axios
                      .post("https://jira.skg.pl/rest/auth/1/session", {
                        username: JIRA_USER,
                        password: JIRA_PASSWORD,
                      })
                      .then((res: any) => {
                        let jiraUser: { name: string; value: string } = {
                          name: res.data.session.name,
                          value: res.data.session.value,
                        };
                        console.log(jiraUser);
                        axios
                          .get(
                            `https://jira.skg.pl/rest/api/2/search?jql=summary~${key}`,
                            {
                              headers: {
                                Cookie: `${jiraUser.name}=${jiraUser.value}`,
                              },
                            }
                          )
                          .then((response: any) => {
                            let issueFound = false;
                            console.log(response.data.issues);
                            if (response.data.issues[0]) {
                              response.data.issues.forEach((element: any) => {
                                if (
                                  (element.fields.status.id === "10003" &&
                                    issueFound === false) ||
                                  (element.fields.status.id === "6" &&
                                    element.fields.parent.key ===
                                      jira[0].jiraKey &&
                                    issueFound === false)
                                ) {
                                  issueFound = true;
                                  let startIndexBody =
                                    body.indexOf("Ostatni komentarz:");
                                  let IssuesBody = body.slice(startIndexBody);
                                  axios
                                    .post(
                                      `${element.self}/transitions`,
                                      {
                                        update: {
                                          comment: [
                                            { add: { body: IssuesBody } },
                                          ],
                                        },
                                        transition: { id: "3" },
                                      },
                                      {
                                        headers: {
                                          Cookie: `${jiraUser.name}=${jiraUser.value}`,
                                        },
                                      }
                                    )
                                    .then((response: any) => {
                                      console.log(
                                        `Otwarto ponownie zgłoszenie ${element.key}`
                                      );
                                    })
                                    .catch((error: Error) => {
                                      console.log(error);
                                    });
                                }
                              });
                            }
                            if (!issueFound) {
                              let isOpen = false;
                              let startIndexBody =
                                body.indexOf("Opis zgłoszenia:");
                              let IssuesBody = body.slice(startIndexBody);
                              response.data.issues.forEach((element: any) => {
                                if (
                                  element.fields.status.id === "1" ||
                                  element.fields.status.id === "3"
                                ) {
                                  isOpen = true;
                                }
                              });
                              if (!isOpen) {
                                axios
                                  .post(
                                    `https://jira.skg.pl/rest/api/2/issue`,
                                    {
                                      fields: {
                                        project: {
                                          id: "10690",
                                        },
                                        parent: {
                                          key: jira[0].jiraKey,
                                        },
                                        summary: `${key} : ${store} : ${topic}`,
                                        description: IssuesBody,
                                        issuetype: {
                                          id: "5",
                                        },
                                        priority: {
                                          id: "5",
                                        },
                                        assignee: {
                                          name: "helpdesk",
                                        },
                                      },
                                    },
                                    {
                                      headers: {
                                        Cookie: `${jiraUser.name}=${jiraUser.value}`,
                                      },
                                    }
                                  )
                                  .then((response: any) => {
                                    console.log("Utworzono zgłoszenie");
                                  })
                                  .catch((error: Error) => {
                                    console.log(error);
                                  });
                              }
                            }
                          })
                          .catch((error: Error) => {
                            console.log(error);
                          });
                      })
                      .catch((error: Error) => {
                        console.log(error);
                      });
                  }
                });
              });
            });
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
}
setInterval(myInterval, 5 * 60000); // minuta = 60000
