import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Zabbix } from './entities/zabbix.entity';
import { ApiZabbix } from './dto/getZabbix';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

const ZABBIX_URL = process.env.ZABBIX_URL;
const ZABBIX_USER = process.env.ZABBIX_USER;
const ZABBIX_PASSWORD = process.env.ZABBIX_PASSWORD;

@Injectable()
export class ZabbixService {
  constructor(
    @InjectRepository(Zabbix)
    private zabbixRepository: Repository<Zabbix>,
  ) {}

  async findByEventId(eventId: number): Promise<Zabbix | null> {
    return this.zabbixRepository.findOne({ where: { eventId } });
  }

  async update(id: number, updateZabbixDto: any): Promise<any> {
    return this.zabbixRepository.update(id, updateZabbixDto);
  }

  async getAll(): Promise<Zabbix[] | null> {
    return this.zabbixRepository.find();
  }

  async findByTime(timeStamp: number): Promise<Zabbix[] | null> {
    const compareDate = new Date(timeStamp);
    return this.zabbixRepository.find({
      where: { clock: MoreThan(compareDate) },
    });
  }

  async zabbixFetchProblem(token: string): Promise<ApiZabbix[]> {
    let date: Date | string = new Date();
    date.setTime(Date.now());
    const timestamp = Math.floor(date.getTime() / 1000 - 17280000); // 3600 1h
    const zabbixFetchProblemPost = {
      jsonrpc: '2.0',
      method: 'problem.get',
      params: {
        output: 'extend',
        selectAcknowledges: 'extend',
        selectSuppressionData: 'extend',
        recent: 'false',
        sortfield: ['eventid'],
        time_from: `${timestamp}`,
        sortorder: 'DESC',
      },
      id: 1,
    };
    let retrunData = [];
    await axios
      .post(ZABBIX_URL, zabbixFetchProblemPost, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        retrunData = res.data.result;
      })
      .catch((err) => {
        console.log('Zabbix - fetch problem');
      });
    return retrunData;
  }

  async getHostName(eventId: string, token: string): Promise<string> {
    const zabbixFetchHostName = {
      jsonrpc: '2.0',
      method: 'event.get',
      params: {
        eventids: eventId,
        selectHosts: ['host', 'name'],
      },
      id: 1,
    };
    let returnData = '';
    await axios
      .post(ZABBIX_URL, zabbixFetchHostName, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        returnData = res.data.result[0].hosts[0].name;
      })
      .catch((err) => {
        console.log('Zabbix - fetch host name problem');
      });
    return returnData;
  }

  @Cron('0 */5 * * * *')
  async automaticCheckProblems() {
    try {
      axios
        .post(ZABBIX_URL, {
          jsonrpc: '2.0',
          method: 'user.login',
          params: {
            username: ZABBIX_USER,
            password: ZABBIX_PASSWORD,
          },
          id: 1,
        })
        .then(async (response) => {
          const token = response.data.result;
          const zabbixProblems: ApiZabbix[] =
            await this.zabbixFetchProblem(token);
          if (zabbixProblems.length > 0) {
            zabbixProblems.forEach(async (problem: ApiZabbix, key: number) => {
              let isRegister = await this.findByEventId(
                Number(problem.eventid),
              );
              if (!isRegister) {
                const zabbixProblem = new Zabbix();
                zabbixProblem.clock = new Date(Number(problem.clock) * 1000);
                zabbixProblem.eventId = Number(problem.eventid);
                zabbixProblem.recoveryEventId = Number(problem.r_eventid);
                zabbixProblem.name = problem.name;
                zabbixProblem.opdata = problem.opdata;
                zabbixProblem.objectId = Number(problem.objectid);
                zabbixProblem.severity = Number(problem.severity);
                zabbixProblem.host = await this.getHostName(
                  problem.eventid,
                  token,
                );
                this.zabbixRepository.save(zabbixProblem);
              }
            });
          }
        })
        .catch((error) => {
          console.log('Zabbix - loggging error');
        });
    } catch (error) {}
  }

  @Cron('0 */5 * * * *')
  async automaticCheckProblemsRecovery() {
    try {
      const problems = await this.zabbixRepository.find({
        where: { recoveryEventId: 0 },
      });
      axios
        .post(ZABBIX_URL, {
          jsonrpc: '2.0',
          method: 'user.login',
          params: {
            username: ZABBIX_USER,
            password: ZABBIX_PASSWORD,
          },
          id: 1,
        })
        .then(async (response) => {
          const token = response.data.result;
          problems.forEach(async (problem) => {
            await axios
              .post(
                ZABBIX_URL,
                {
                  jsonrpc: '2.0',
                  method: 'event.get',
                  params: {
                    eventids: problem.eventId,
                    selectHosts: ['host', 'name'],
                  },
                  id: 1,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              )
              .then((res) => {
                if (res.data.result[0].r_eventid !== 0) {
                  let update = {
                    recoveryEventId: res.data.result[0].r_eventid,
                    opdata: res.data.result[0].opdata,
                  };
                  this.update(problem.id, update);
                }
              })
              .catch((err) => {
                console.log('Zabbix - fetch event problem');
              });
          });
        })
        .catch((error) => {
          console.log('Zabbix - loggging error');
        });
    } catch (error) {}
  }
}
