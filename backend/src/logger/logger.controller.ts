import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { GetLogFilterDto } from './dto/getLog';

@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  //@UseGuards(AccessTokenGuard)
  @Get()
  getLogs(@Query() filterDto: GetLogFilterDto) {
    return this.loggerService.getLogs(filterDto);
  }
}
