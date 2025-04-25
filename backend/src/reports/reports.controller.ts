import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/blocked')
  getBlockedReports() {
    return this.reportsService.getBlockedReports();
  }

  @UseGuards(AccessTokenGuard)
  @Get('/morning')
  getMorningReports(@Request() req) {
    this.reportsService.getMorningReport(req.headers.authorization);
    return 'Zlecono raport poranny';
  }

  @UseGuards(AccessTokenGuard)
  @Get('/volumetrics')
  getVolumetricsReports(@Request() req) {
    this.reportsService.generateVolumetricsReport(req.headers.authorization);
    return 'Zlecono raport wolumetryki';
  }

  @UseGuards(AccessTokenGuard)
  @Post('/sla')
  getSLAReports(@Req() req) {
    this.reportsService.generateSLAReport(req, req.headers.authorization);
    return 'Zlecono raport SLA';
  }
}
