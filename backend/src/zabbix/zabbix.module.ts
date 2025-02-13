import { Module } from '@nestjs/common';
import { ZabbixService } from './zabbix.service';
import { ZabbixController } from './zabbix.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zabbix } from './entities/zabbix.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  controllers: [ZabbixController],
  providers: [ZabbixService],
  imports: [TypeOrmModule.forFeature([Zabbix]), LoggerModule],
})
export class ZabbixModule {}
