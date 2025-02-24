import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { Cron } from '@nestjs/schedule';
import { samboDbConfig } from 'src/samboDB';
import { EMAIL, transporter } from 'src/nodemailer';
import { LoggerService } from 'src/logger/logger.service';
import { LogTaskType } from 'src/logger/dto/createLog';
import { LogStatus } from 'src/logger/dto/getLog';

const oracledb = require('oracledb');

interface SQLType {
  DUR: number;
  OSUSER: string;
  SQL_ID: string;
  STATUS: string;
}

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private loggerService: LoggerService,
  ) {}

  @Cron('*/15 * * * *', {
    name: LogTaskType.RUNNING_SQL_MONITORING,
  })
  async automaticRunningSQLMonitoring() {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.RUNNING_SQL_MONITORING,
      status: LogStatus.OPEN,
    });
    try {
      let conn = await oracledb.getConnection(samboDbConfig);
      const result = await conn.execute(
        `select distinct * from
  (
  select round((sysdate - s.sql_exec_start) * 24 * 60 * 60, 0) as dur, s.osuser, s.sql_id, s.status from v$session s join v$sql q on s.sql_id = q.sql_id
  ) tt
  where 1=1 and status = 'ACTIVE' and osuser = 'weblogic' and tt.dur > 1 order by tt.dur desc`,
      );
      await conn.close();
      const fileredRows = result.rows.filter((row: SQLType, key: number) => {
        if (row.DUR >= 1800) {
          let check = result.rows.filter(
            (check: SQLType, i: number) =>
              key !== i && check.SQL_ID === row.SQL_ID && check.DUR >= 1800,
          );
          if (check.length > 0) return check;
        }
      });
      if (fileredRows.length > 0) {
        let htmlRawText = '';
        fileredRows.forEach((sql: SQLType) => {
          htmlRawText =
            htmlRawText +
            `${sql.SQL_ID}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${sql.DUR}s<br />`;
        });
        transporter
          .sendMail({
            from: EMAIL,
            to: 'esambo_hd@asseco.pl',
            subject: 'Warning: Długo przetwarzające się SQL',
            html: `<p>Długo przetwarzające SQL:<br />
                 <br />
         SQL_ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Czas trwania <br />
         ${htmlRawText}</p>`,
          })
          .then((info: any) => {
            this.loggerService.createLog({
              taskId: logId,
              task: LogTaskType.RUNNING_SQL_MONITORING,
              status: LogStatus.IN_PROGRESS,
              description: `${htmlRawText}`,
            });
          })
          .catch((error) => {
            this.loggerService.createLog({
              taskId: logId,
              task: LogTaskType.RUNNING_SQL_MONITORING,
              status: LogStatus.IN_PROGRESS,
              description: `${error}`,
            });
          });
      }
      await this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.RUNNING_SQL_MONITORING,
        status: LogStatus.DONE,
      });
    } catch (error) {
      await this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.RUNNING_SQL_MONITORING,
        status: LogStatus.DONE,
        description: `${error}`,
      });
    }
  }

  @Cron('0 */1 * * *', {
    name: LogTaskType.ARCHIVELOG_PROD_MONITORING,
  })
  async automaticArchivelogPRODMonitoring() {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.ARCHIVELOG_PROD_MONITORING,
      status: LogStatus.OPEN,
    });
    try {
      let conn = await oracledb.getConnection(samboDbConfig);
      const result = await conn.execute(
        `select count(1) as cnt from v$archived_log where standby_dest = 'YES' and applied = 'NO'`,
      );
      await conn.close();
      if (result.rows[0].CNT >= 3) {
        transporter
          .sendMail({
            from: EMAIL,
            to: 'esambo_hd@asseco.pl',
            subject: 'Warning: Archivelog - PRODUKCJA',
            html: `<p>Problem z archivelog, obecnie ilość plików logów niezaaplikowanych na baze zapasową ${result.rows[0].CNT}.<br /></p>`,
          })
          .then((info: any) => {
            this.loggerService.createLog({
              taskId: logId,
              task: LogTaskType.ARCHIVELOG_PROD_MONITORING,
              status: LogStatus.IN_PROGRESS,
              description: `Archivelog not applied: ${result.rows[0].CNT} count`,
            });
          })
          .catch((error) => {
            this.loggerService.createLog({
              taskId: logId,
              task: LogTaskType.ARCHIVELOG_PROD_MONITORING,
              status: LogStatus.IN_PROGRESS,
              description: `${error}`,
            });
          });
      }
      await this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.ARCHIVELOG_PROD_MONITORING,
        status: LogStatus.DONE,
        description: `Archivelog not applied: ${result.rows[0].CNT} count`,
      });
    } catch (error) {
      await this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.ARCHIVELOG_PROD_MONITORING,
        status: LogStatus.DONE,
        description: `${error}`,
      });
    }
  }

  @Cron('0 */1 * * *', {
    name: LogTaskType.ARCHIVELOG_PROD_MONITORING2,
  })
  async automaticArchivelogPRODMonitoring2() {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.ARCHIVELOG_PROD_MONITORING2,
      status: LogStatus.OPEN,
    });
    try {
      let conn = await oracledb.getConnection(samboDbConfig);
      const result = await conn.execute(
        `select (sysdate - min(first_time)) * 24 as log_h from v$archived_log where name is not null and standby_dest = 'NO'`,
      );
      await conn.close();
      if (Math.round(result.rows[0].LOG_H) >= 30) {
        transporter
          .sendMail({
            from: EMAIL,
            to: 'esambo_hd@asseco.pl',
            subject: 'Warning: Archivelog - PRODUKCJA',
            html: `<p>Problem z archivelog, obecnie opóźnienie to ${Math.round(result.rows[0].LOG_H)} godzin.<br /></p>`,
          })
          .then((info: any) => {
            this.loggerService.createLog({
              taskId: logId,
              task: LogTaskType.ARCHIVELOG_PROD_MONITORING,
              status: LogStatus.IN_PROGRESS,
              description: `Monitoring - delay ${Math.round(result.rows[0].LOG_H)} h`,
            });
          })
          .catch((error) => {
            this.loggerService.createLog({
              taskId: logId,
              task: LogTaskType.ARCHIVELOG_PROD_MONITORING,
              status: LogStatus.IN_PROGRESS,
              description: `${error}`,
            });
          });
      }
      this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.ARCHIVELOG_PROD_MONITORING,
        status: LogStatus.DONE,
        description: `Monitoring - delay ${Math.round(result.rows[0].LOG_H)} h`,
      });
    } catch (error) {
      this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.ARCHIVELOG_PROD_MONITORING,
        status: LogStatus.DONE,
        description: `${error}`,
      });
    }
  }

  @Cron('0 */1 * * *', {
    name: LogTaskType.ARCHIVELOG_REP_MONITORING,
  })
  async automaticArchivelogREPMonitoring() {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.ARCHIVELOG_REP_MONITORING,
      status: LogStatus.OPEN,
    });
    try {
      let conn = await oracledb.getConnection({
        user: 'SYS',
        password: process.env.SAMBODBSYS_PASSWORD,
        privilege: oracledb.SYSDBA,
        poolMin: 20,
        poolIncrement: 0,
        poolMax: 20,
        connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.SAMBODBSYS_IP})(PORT=${process.env.SAMBODB_PORT}))(CONNECT_DATA=(SERVER=DEDICATED)(SID=${process.env.SAMBODB_SID})))`,
      });
      const result = await conn.execute(
        `select (sysdate - min(first_time)) * 24 as log_h from v$archived_log where name is not null and standby_dest = 'NO'`,
      );
      await conn.close();
      if (Math.round(result.rows[0].LOG_H) >= 30) {
        transporter
          .sendMail({
            from: EMAIL,
            to: 'esambo_hd@asseco.pl',
            subject: 'Warning: Archivelog - ZAPAS',
            html: `<p>Problem z archivelog, obecnie opóźnienie to ${Math.round(result.rows[0].LOG_H)} godzin.<br /></p>`,
          })
          .then((info: any) => {
            this.loggerService.createLog({
              taskId: logId,
              task: LogTaskType.ARCHIVELOG_REP_MONITORING,
              status: LogStatus.IN_PROGRESS,
              description: `Replication delay ${Math.round(result.rows[0].LOG_H)} h`,
            });
          })
          .catch((error) => {
            this.loggerService.createLog({
              taskId: logId,
              task: LogTaskType.ARCHIVELOG_REP_MONITORING,
              status: LogStatus.IN_PROGRESS,
              description: `${error}`,
            });
          });
      }
      this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.ARCHIVELOG_REP_MONITORING,
        status: LogStatus.DONE,
        description: `Replication delay ${Math.round(result.rows[0].LOG_H)} h`,
      });
    } catch (error) {
      this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.ARCHIVELOG_REP_MONITORING,
        status: LogStatus.DONE,
        description: `${error}`,
      });
    }
  }
}
