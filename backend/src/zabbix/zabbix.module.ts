import { Module } from '@nestjs/common';
import { ZabbixService } from './zabbix.service';
import { ZabbixController } from './zabbix.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zabbix } from './entities/zabbix.entity';

@Module({
  controllers: [ZabbixController],
  providers: [ZabbixService],
  imports: [TypeOrmModule.forFeature([Zabbix])],
})
export class ZabbixModule {}
