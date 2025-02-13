import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [TerminusModule, HttpModule, LoggerModule],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
