import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { HealthService } from './health.service';
import { HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  @UseGuards(AccessTokenGuard)
  @Get('CEN')
  @HealthCheck()
  getHealthCEN() {
    return this.healthService.CENHealthCheck();
  }
}
