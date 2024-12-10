import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { Cron } from '@nestjs/schedule';
import { samboDbConfig } from 'src/samboDB';
import { EMAIL, transporter } from 'src/nodemailer';

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
  ) {}
  @Cron('0 */15 * * * *')
  async automaticRunningSQLMonitoring() {
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
            console.log({ info });
          })
          .catch(console.error);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
