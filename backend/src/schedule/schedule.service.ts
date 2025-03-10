import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/logger/logger.service';
import { Cron, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { UpdateScheduleDto } from './dto/updateSchedule';
import { LogTaskType } from 'src/logger/dto/createLog';
import { LogStatus } from 'src/logger/dto/getLog';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private loggerService: LoggerService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async getSchedules() {
    return this.scheduleRepository.find();
  }

  async getSchedule(task: LogTaskType) {
    return this.scheduleRepository.findOne({ where: { task } });
  }

  async updateSchedule(
    updateScheduleDto: UpdateScheduleDto,
    accessToken: string,
  ) {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.UPDATE_SCHEDULE,
      status: LogStatus.OPEN,
      description: `${updateScheduleDto.task}`,
      accessToken: accessToken,
    });
    try {
      const databaseTask = await this.scheduleRepository.findOne({
        where: { task: updateScheduleDto.task },
      });
      const task = this.schedulerRegistry.getCronJob(updateScheduleDto.task);
      task.stop();
      const CronTime = require('cron').CronTime;
      task.setTime(new CronTime(updateScheduleDto.schedule));
      if (updateScheduleDto.isActive === true) task.start();
      await this.scheduleRepository.update(databaseTask._id, updateScheduleDto);
      this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.UPDATE_SCHEDULE,
        status: LogStatus.DONE,
        description: `${updateScheduleDto.task} set cron:${updateScheduleDto.schedule}`,
        accessToken: accessToken,
      });
      return await this.scheduleRepository.findOne({
        where: { task: updateScheduleDto.task },
      });
    } catch (error) {
      this.loggerService.createLog({
        taskId: logId,
        task: LogTaskType.UPDATE_SCHEDULE,
        status: LogStatus.IN_PROGRESS,
        description: `No tasks ${updateScheduleDto.task} found`,
        accessToken: accessToken,
      });
      throw new BadRequestException(`No tasks ${updateScheduleDto.task} found`);
    }
  }

  @Timeout(1000)
  async onStartUpdateCron() {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.UPDATE_SCHEDULE,
      status: LogStatus.OPEN,
      description: `Automatic update schedule`,
    });
    const schedules = await this.scheduleRepository.find();
    schedules.map((schedule) => {
      const task = this.schedulerRegistry.getCronJob(schedule.task);
      task.stop();
      const CronTime = require('cron').CronTime;
      task.setTime(new CronTime(schedule.schedule));
      if (schedule.isActive === true) task.start();
    });
    this.loggerService.createLog({
      task: LogTaskType.UPDATE_SCHEDULE,
      status: LogStatus.DONE,
      taskId: logId,
      description: `Automatic update schedule`,
    });
  }
}
