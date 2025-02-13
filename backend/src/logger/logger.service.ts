import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Logger } from './entities/logger.entity';
import { GetLogFilterDto, LogStatus } from './dto/getLog';
import { CreateLogDto, LogTaskType } from './dto/createLog';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(Logger)
    private loggerRepository: Repository<Logger>,
    private jwtService: JwtService,
  ) {}

  async getLogs(filterDto: GetLogFilterDto) {
    const { taskId, status, orderedBy } = filterDto;
    const query = this.loggerRepository.createQueryBuilder('logger');
    if (status) query.where('logger.status = :status', { status });
    if (taskId) query.andWhere('logger.taskId = :taskId', { taskId });
    if (orderedBy)
      query.andWhere('logger.orderedBy = :orderedBy', { orderedBy });
    try {
      const log = await query.getMany();
      return log;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createLog(createlogDto: CreateLogDto) {
    const log = new Logger();
    log.status = createlogDto.status;
    log.task = createlogDto.task;
    if (createlogDto.description) log.description = createlogDto.description;
    if (createlogDto.taskId) log.taskId = createlogDto.taskId;
    else {
      const uuid = uuidv4();
      log.taskId = uuid;
    }
    if (
      createlogDto.accessToken === undefined &&
      createlogDto.orderedBy === undefined
    ) {
      log.orderedBy = 'system';
    } else if (createlogDto.orderedBy) {
      log.orderedBy = createlogDto.orderedBy;
    } else {
      const user = this.jwtService.decode(createlogDto.accessToken.slice(7));
      log.orderedBy = user.payload.email.replace('@asseco.pl', '');
    }
    await this.loggerRepository.save(log);
    return log.taskId;
  }

  @Cron('0 8 * * *', {
    name: LogTaskType.DELETE_OLD_LOGS,
  })
  async automaticLogCleaner() {
    const logId = await this.createLog({
      task: LogTaskType.DELETE_OLD_LOGS,
      status: LogStatus.OPEN,
    });
    let date = new Date();
    date.setDate(date.getDate() - 14);
    await this.loggerRepository.delete({
      createdAt: LessThanOrEqual(date),
    });
    this.createLog({
      taskId: logId,
      task: LogTaskType.DELETE_OLD_LOGS,
      status: LogStatus.DONE,
    });
  }
}
