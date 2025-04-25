import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gica } from './entities/gica.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { samboDbConfig } from 'src/samboDB';
import { LoggerService } from 'src/logger/logger.service';
import { LogTaskType } from 'src/logger/dto/createLog';
import { LogStatus } from 'src/logger/dto/getLog';

const oracledb = require('oracledb');

@Injectable()
export class GicaService {
  constructor(
    @InjectRepository(Gica)
    private gicaRepository: Repository<Gica>,
    private loggerService: LoggerService,
  ) {}

  async getGica(): Promise<Gica[]> {
    const gica = await this.gicaRepository.find({
      order: { date: 'DESC' },
      take: 31,
    });
    return gica;
  }

  async getGicaTimeByStoreType(
    storeType: 'N' | 'H',
    yesterday: string,
    today: string,
  ) {
    let conn = await oracledb.getConnection(samboDbConfig);
    await conn.execute(
      `alter session set NLS_DATE_FORMAT = 'yyyy-mm-dd HH24:MI:SS'`,
    );
    const result = await conn.execute(
      `select  tm_start, tm_end
from s_jobs, es_stores
where parent_id in 
  (select s_jobs.id from s_jobs, ES_STORES
  where s_jobs.queue='PerformOperationQueue'
  and s_jobs.operation_code ='UpdateManagingStore'
  and s_jobs.org_id = es_stores.org_id
  and s_jobs.tm_start > '${yesterday}' and s_jobs.tm_end < '${today}')
and s_jobs.org_id = es_stores.org_id
and es_stores.store_type ='${storeType}' 
ORDER BY tm_end DESC fetch first 1 rows only`,
    );
    let returnTime = {
      TM_START: result.rows[0].TM_START,
      TM_END: result.rows[0].TM_END,
    };
    await conn.close();
    return returnTime;
  }

  async getGicaReceiveTime(yesterday: string, today: string) {
    let conn = await oracledb.getConnection(samboDbConfig);
    await conn.execute(
      `alter session set NLS_DATE_FORMAT = 'yyyy-mm-dd HH24:MI:SS'`,
    );
    const result = await conn.execute(
      `select * from s_jobs where QUEUE ='GICAReceiveQueue' and TM_START > '${yesterday}' and TM_END < '${today}'`,
    );
    let returnTime = {
      TM_START: result.rows[0].TM_START,
      TM_END: result.rows[0].TM_END,
    };
    await conn.close();
    return returnTime;
  }

  async getMinutesBetween(date1: Date, date2: Date): Promise<number> {
    return parseFloat(((date2.getTime() - date1.getTime()) / 60000).toFixed(2));
  }

  @Cron('50 5 * * *', {
    name: LogTaskType.GET_GICA,
  })
  async automaticYesterdayGICA() {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.GET_GICA,
      status: LogStatus.OPEN,
    });
    try {
      let GICA = new Gica();
      let date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day} 15:00:00`;
      let date2 = new Date();
      date2.setDate(date2.getDate() - 1);
      const day2 = String(date2.getDate()).padStart(2, '0');
      const month2 = String(date2.getMonth() + 1).padStart(2, '0');
      const year2 = date2.getFullYear();
      const yest = `${year2}-${month2}-${day2} 00:00:00`;
      let gicaReceive = await this.getGicaReceiveTime(yest, today);
      let gicaTimeNetworkStore = await this.getGicaTimeByStoreType(
        'N',
        yest,
        today,
      );
      let gicaTimeHypermarket = await this.getGicaTimeByStoreType(
        'H',
        yest,
        today,
      );
      GICA.ReceiveStart = gicaReceive.TM_START;
      GICA.ReceiveEnd = gicaReceive.TM_END;
      GICA.ReceiveTimeInMinutes = await this.getMinutesBetween(
        gicaReceive.TM_START,
        gicaReceive.TM_END,
      );
      GICA.NetworkStoreStart = gicaTimeNetworkStore.TM_START;
      GICA.NetworkStoreEnd = gicaTimeNetworkStore.TM_END;
      GICA.NetworkStoreTimeInMinutes = await this.getMinutesBetween(
        gicaTimeNetworkStore.TM_START,
        gicaTimeNetworkStore.TM_END,
      );
      GICA.HypermarketStart = gicaTimeHypermarket.TM_START;
      GICA.HypermarketEnd = gicaTimeHypermarket.TM_END;
      GICA.HypermarketTimeInMinutes = await this.getMinutesBetween(
        gicaTimeHypermarket.TM_START,
        gicaTimeHypermarket.TM_END,
      );
      GICA.date = new Date(yest);
      this.gicaRepository.insert(GICA);
      await this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.GET_GICA,
        status: LogStatus.DONE,
        description: 'Automatic yesterday GICA updated',
      });
    } catch (error) {
      await this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.GET_GICA,
        status: LogStatus.DONE,
        description: `${error}`,
      });
    }
  }
}
