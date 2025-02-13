import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from './entities/jobs.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { samboDbConfig } from '../samboDB';
import { EndJobDto } from './dto/endJob';
import { RestartJobDto } from './dto/restartJob';
import { JobType } from './dto/createJob';
import { LoggerService } from 'src/logger/logger.service';
import { LogTaskType } from 'src/logger/dto/createLog';
import { LogStatus } from 'src/logger/dto/getLog';

const oracledb = require('oracledb');

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Jobs)
    private jobsRepository: Repository<Jobs>,
    private loggerService: LoggerService,
  ) {}

  async getJobs(): Promise<Jobs[]> {
    return this.jobsRepository.find();
  }

  async endJob(endJobDto: EndJobDto, accessToken: string) {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.END_JOB,
      status: LogStatus.OPEN,
      accessToken: accessToken,
    });
    const id = endJobDto.id;
    const conn = await oracledb.getConnection(samboDbConfig);
    await conn.execute(`update s_jobs set status = 'E' where id = '${id}'`);
    await conn.commit();
    await conn.close();
    await this.jobsRepository.delete({ jobId: id });
    await this.loggerService.createLog({
      taskId: logId,
      task: LogTaskType.END_JOB,
      status: LogStatus.DONE,
      accessToken: accessToken,
      description: `Job ${id} has been ended`,
    });
    return `Job ${id} has been ended`;
  }

  async restartJob(restartJobDto: RestartJobDto, accessToken: string) {
    const id = restartJobDto.id;
    const logId = await this.loggerService.createLog({
      task: LogTaskType.RESTART_JOB,
      status: LogStatus.OPEN,
      accessToken: accessToken,
    });
    const conn = await oracledb.getConnection(samboDbConfig);
    await conn.execute(
      `update s_jobs set status = 'R', tm_restart = sysdate where id = '${id}'`,
    );
    await conn.commit();
    await conn.close();
    await this.jobsRepository.update({ jobId: id }, { status: 'R' });
    await this.loggerService.createLog({
      taskId: logId,
      task: LogTaskType.RESTART_JOB,
      status: LogStatus.DONE,
      accessToken: accessToken,
      description: `Job ${id} has been restarted`,
    });
    return `Job ${id} has been restarted`;
  }

  @Cron('*/1 * * * *', {
    name: LogTaskType.GET_ACTUAL_ESAMBO_JOBS,
  })
  async automaticUpdateJobs() {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.GET_ACTUAL_ESAMBO_JOBS,
      status: LogStatus.OPEN,
    });
    await this.jobsRepository.clear();
    try {
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
      this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.GET_ACTUAL_ESAMBO_JOBS,
        status: LogStatus.IN_PROGRESS,
        description: `${error}`,
      });
    }
    await this.loggerService.createLog({
      taskId: logId,
      task: LogTaskType.GET_ACTUAL_ESAMBO_JOBS,
      status: LogStatus.DONE,
      description: 'Jobs from eSambo has been updated',
    });
  }
}
