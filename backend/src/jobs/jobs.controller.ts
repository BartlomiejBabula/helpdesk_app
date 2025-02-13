import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
  endJob(@Body() endJobDto: EndJobDto, @Req() req) {
    const accessToken = req.headers.authorization;
    return this.jobsService.endJob(endJobDto, accessToken);
  }

  @UseGuards(AccessTokenGuard)
  @Post('restart')
  restartJob(@Body() restartJobDto: RestartJobDto, @Req() req) {
    const accessToken = req.headers.authorization;
    return this.jobsService.restartJob(restartJobDto, accessToken);
  }
}
