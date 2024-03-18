import { Module } from '@nestjs/common';
import { JiraService } from './jira.service';
import { JiraController } from './jira.controller';
import { Jira } from './entities/jira.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Jira])],
  providers: [JiraService],
  controllers: [JiraController],
})
export class JiraModule {}
