import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from './entities/jobs.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { samboDbConfig } from '../samboDB';
import { EndJobDto } from './dto/endJob';
import { RestartJobDto } from './dto/restartJob';
import { JobType } from './dto/createJob';

const oracledb = require('oracledb');

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Jobs)
    private jobsRepository: Repository<Jobs>,
  ) {}

  async getJobs(): Promise<Jobs[]> {
    return this.jobsRepository.find();
  }

  async endJob(endJobDto: EndJobDto) {
    const id = endJobDto.id;
    const conn = await oracledb.getConnection(samboDbConfig);
    await conn.execute(`update s_jobs set status = 'E' where id = '${id}'`);
    await conn.commit();
    await conn.close();
    await this.jobsRepository.delete({ jobId: id });
    return `Job ${id} has been ended`;
  }

  async restartJob(restartJobDto: RestartJobDto) {
    const id = restartJobDto.id;
    const conn = await oracledb.getConnection(samboDbConfig);
    await conn.execute(
      `update s_jobs set status = 'R', tm_restart = sysdate where id = '${id}'`,
    );
    await conn.commit();
    await conn.close();
    await this.jobsRepository.update({ jobId: id }, { status: 'R' });
    return `Job ${id} has been restarted`;
  }

  @Cron('0 */1 * * * *')
  async automaticUpdateJobs() {
    await this.jobsRepository.clear();
    try {
      console.log('automatic jobs update');
      let conn = await oracledb.getConnection(samboDbConfig);
      const result = await conn.execute(
        "select s.store_number, j.* from s_jobs j join es_stores s on j.org_id = s.org_id where j.queue like '%Queue' and j.status in ('P','R','B')",
      );
      await conn.close();
      result.rows.forEach((job: JobType) => {
        let newJob = new Jobs();
        newJob = {
          ...newJob,
          jobId: job.ID,
          storeNumber: job.STORE_NUMBER,
          queue: job.QUEUE,
          status: job.STATUS,
          docId: job.DOC_ID,
          parentId: job.PARENT_ID,
          ordered: job.ORDERED,
          tmStart: new Date(job.TM_START),
          tmCreate: new Date(job.TM_CREATE),
          tmRestart: new Date(job.TM_RESTART),
          infoMessage: job.INFO_MESSAGE,
          errorMessage: job.ERROR_MESSAGE,
        };
        this.jobsRepository.save(newJob);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
