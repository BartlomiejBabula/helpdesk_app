import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JiraModule } from './jira/jira.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';
import { StoresModule } from './stores/stores.module';
import { ReportsModule } from './reports/reports.module';
import { GicaModule } from './gica/gica.module';
import { ZabbixModule } from './zabbix/zabbix.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';
import { ScheduleModule as Schedule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'mongodb',
      url: `mongodb://admin:Haselko123!@database:27017/helpdeskApp_db?authSource=admin`,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    JiraModule,
    JobsModule,
    StoresModule,
    ReportsModule,
    GicaModule,
    ZabbixModule,
    HealthModule,
    LoggerModule,
    Schedule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
