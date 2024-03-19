import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jira } from './entities/jira.entity';
import { Repository } from 'typeorm';
import { UpdateJiraDto } from './dto/updateJira';
import axios from 'axios';
import { configImap } from '../nodemailer';
import { Cron } from '@nestjs/schedule';

let lastuid: number = 1;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_PASSWORD = process.env.JIRA_PASSWORD;
const simpleParser = require('mailparser').simpleParser;
const imaps = require('imap-simple');
const _ = require('lodash');

@Injectable()
export class JiraService {
  constructor(
    @InjectRepository(Jira)
    private jiraRepository: Repository<Jira>,
  ) {}

  async getJira() {
    const fetchedJira = await this.jiraRepository.findOne({ where: { id: 1 } });
    return fetchedJira;
  }

  async updateJira(newJira: UpdateJiraDto) {
    const jiraExist = await this.jiraRepository.findOne({ where: { id: 1 } });
    if (jiraExist === null) {
      const jira = new Jira();
      jira.auto = newJira.auto;
      jira.jiraKey = newJira.jiraKey;
      this.jiraRepository.save(jira);
    } else {
      this.jiraRepository.update(1, newJira);
    }
    return newJira;
  }

  @Cron('0 */5 * * * *')
  async automaticJiraRegister() {
    let date: Date | string = new Date();
    date.setTime(Date.now());
    date = date.toISOString();
    console.log('automatic jira register');
    let jira = await this.jiraRepository.findOne({ where: { id: 1 } });
    if (jira && jira.auto === true) {
      imaps
        .connect(configImap)
        .then((connection: any) => {
          console.log('Connection - email');
          return connection.openBox('INBOX').then(() => {
            console.log('Open INBOX');
            let searchCriteria = [
              ['SINCE', date],
              'UNSEEN',
              // ["FROM", "optimus@carrefour.com"],
              ['UID', `${lastuid + 1}:*`],
            ];
            let fetchOptions = {
              bodies: ['HEADER', 'TEXT', ''],
              markSeen: true,
            };
            return connection
              .search(searchCriteria, fetchOptions)
              .then((messages: any) => {
                let taskList = messages.map((item: any) => {
                  return new Promise<void>((resolve, reject) => {
                    let all = _.find(item.parts, { which: '' });
                    let id = item.attributes.uid;
                    let idHeader = 'Imap-Id: ' + id + '\r\n';
                    simpleParser(
                      idHeader + all.body,
                      (err: Error, mail: any) => {
                        let body = mail.html;
                        body = body
                          .replace(/\n/gi, '')
                          .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/gi, '')
                          .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/gi, '')
                          .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gi, '')
                          .replace(/<\/\s*(?:p|div)>/gi, '\n')
                          .replace(/<br[^>]*\/?>/gi, '\n')
                          .replace(/<[^>]*>/gi, '')
                          .replace('&nbsp;', ' ')
                          .replace(/[^\S\r\n][^\S\r\n]+/gi, ' ');

                        if (mail.subject.includes('SD-')) {
                          lastuid = id;
                          let startIndex = mail.subject.indexOf('(SD-');
                          let key = mail.subject.slice(
                            startIndex + 1,
                            startIndex + 10,
                          );
                          let startI = body.indexOf('Temat zgłoszenia:');
                          let endI = body.indexOf(
                            'Numer zgłoszenia zewnętrznego:',
                          );
                          let topic = body.slice(startI, endI);
                          if (topic.indexOf('(') !== -1) {
                            let startT = topic.indexOf('(');
                            let endT = topic.indexOf(')');
                            topic = topic.slice(startT + 1, endT);
                          } else {
                            topic = topic.slice(18, endI);
                          }
                          let startS = body.indexOf('Numer bo:') + 10;
                          let store = body.slice(startS, startS + 3);
                          console.log(`Read - ${key} : ${store} : ${topic}`);

                          axios
                            .post('https://jira.skg.pl/rest/auth/1/session', {
                              username: JIRA_USER,
                              password: JIRA_PASSWORD,
                            })
                            .then((res: any) => {
                              let jiraUser: { name: string; value: string } = {
                                name: res.data.session.name,
                                value: res.data.session.value,
                              };
                              axios
                                .get(
                                  `https://jira.skg.pl/rest/api/2/search?jql=summary~${key}`,
                                  {
                                    headers: {
                                      Cookie: `${jiraUser.name}=${jiraUser.value}`,
                                    },
                                  },
                                )
                                .then((response: any) => {
                                  let issueFound = false;
                                  if (response.data.issues[0]) {
                                    response.data.issues.forEach(
                                      (element: any) => {
                                        if (
                                          (element.fields.status.id ===
                                            '10003' &&
                                            issueFound === false) ||
                                          (element.fields.status.id === '6' &&
                                            element.fields.parent.key ===
                                              jira.jiraKey &&
                                            issueFound === false)
                                        ) {
                                          issueFound = true;
                                          let startIndexBody =
                                            body.indexOf('Ostatni komentarz:');
                                          let IssuesBody =
                                            body.slice(startIndexBody);
                                          axios
                                            .post(
                                              `${element.self}/transitions`,
                                              {
                                                update: {
                                                  comment: [
                                                    {
                                                      add: { body: IssuesBody },
                                                    },
                                                  ],
                                                },
                                                transition: { id: '3' },
                                              },
                                              {
                                                headers: {
                                                  Cookie: `${jiraUser.name}=${jiraUser.value}`,
                                                },
                                              },
                                            )
                                            .then((response: any) => {
                                              console.log(
                                                `Otwarto ponownie zgłoszenie ${element.key}`,
                                              );
                                              connection.addFlags(
                                                id,
                                                'Deleted',
                                                (err: Error) => {
                                                  if (err) {
                                                    console.log(
                                                      'Problem marking message for deletion',
                                                    );
                                                    reject(err);
                                                  }
                                                  console.log(
                                                    'Delete readed email',
                                                  );
                                                  resolve(); //Final resolve
                                                },
                                              );
                                            })
                                            .catch((error: Error) => {
                                              console.log(error);
                                            });
                                        }
                                      },
                                    );
                                  }
                                  if (!issueFound) {
                                    let isOpen = false;
                                    let startIndexBody =
                                      body.indexOf('Opis zgłoszenia:');
                                    let IssuesBody = body.slice(startIndexBody);
                                    response.data.issues.forEach(
                                      (element: any) => {
                                        if (
                                          element.fields.status.id === '1' ||
                                          element.fields.status.id === '3'
                                        ) {
                                          isOpen = true;
                                        }
                                      },
                                    );
                                    if (!isOpen) {
                                      axios
                                        .post(
                                          `https://jira.skg.pl/rest/api/2/issue`,
                                          {
                                            fields: {
                                              project: {
                                                id: '10690',
                                              },
                                              parent: {
                                                key: jira.jiraKey,
                                              },
                                              summary: `${key} : ${store} : ${topic}`,
                                              description: IssuesBody,
                                              issuetype: {
                                                id: '5',
                                              },
                                              priority: {
                                                id: '5',
                                              },
                                              assignee: {
                                                name: 'helpdesk',
                                              },
                                            },
                                          },
                                          {
                                            headers: {
                                              Cookie: `${jiraUser.name}=${jiraUser.value}`,
                                            },
                                          },
                                        )
                                        .then((response: any) => {
                                          console.log('Utworzono zgłoszenie');
                                          connection.addFlags(
                                            id,
                                            'Deleted',
                                            (err: Error) => {
                                              if (err) {
                                                console.log(
                                                  'Problem marking message for deletion',
                                                );
                                                reject(err);
                                              }
                                              console.log(
                                                'Delete readed email',
                                              );
                                              resolve(); //Final resolve
                                            },
                                          );
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
                      },
                    );
                  });
                });
                return Promise.all(taskList).then(() => {
                  connection.imap.closeBox(true, (err: Error) => {
                    if (err) {
                      console.log(err);
                    }
                    console.log('Close INBOX');
                  });
                  console.log('Connection close - email');
                  connection.end();
                });
              })
              .catch((error: any) => {
                console.log(error);
              });
          });
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }
}
