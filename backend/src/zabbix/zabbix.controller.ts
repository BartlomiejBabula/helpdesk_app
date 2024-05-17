import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ZabbixService } from './zabbix.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { GetZabbixDto } from './dto/getZabbix';

@Controller('zabbix')
export class ZabbixController {
  constructor(private readonly zabbixService: ZabbixService) {}

  @UseGuards(AccessTokenGuard)
  @Get('all')
  getAllZabbixProblem() {
    return this.zabbixService.getAll();
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  getZabbixProblemFromTime(@Body() getZabbixDto: GetZabbixDto) {
    return this.zabbixService.findByTime(getZabbixDto.timeStamp);
  }
}
