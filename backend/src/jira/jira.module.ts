import { Module } from '@nestjs/common';
import { JiraService } from './jira.service';
import { LoggerModule } from 'src/logger/logger.module';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [LoggerModule, ScheduleModule],
  providers: [JiraService],
})
export class JiraModule {}
