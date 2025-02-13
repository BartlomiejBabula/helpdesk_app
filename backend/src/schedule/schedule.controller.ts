import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { UpdateScheduleDto } from './dto/updateSchedule';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(AccessTokenGuard)
  @Get('')
  getSchedule() {
    return this.scheduleService.getSchedules();
  }

  @UseGuards(AccessTokenGuard)
  @Post('')
  updateSchedule(@Body() updateScheduleDto: UpdateScheduleDto, @Req() req) {
    const accessToken = req.headers.authorization;
    return this.scheduleService.updateSchedule(updateScheduleDto, accessToken);
  }
}
