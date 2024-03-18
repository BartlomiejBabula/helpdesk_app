import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { EndJobDto } from './dto/endJob';
import { RestartJobDto } from './dto/restartJob';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getJobs() {
    return this.jobsService.getJobs();
  }

  @UseGuards(AccessTokenGuard)
  @Post('end')
  endJob(@Body() endJobDto: EndJobDto) {
    return this.jobsService.endJob(endJobDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('restart')
  restartJob(@Body() restartJobDto: RestartJobDto) {
    return this.jobsService.restartJob(restartJobDto);
  }
}
