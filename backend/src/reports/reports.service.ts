import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reports } from './entities/reports.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { generateMorningReport } from './report/morningReport';
import { generateSelenium } from './report/seleniumReport';
import { generateVolumetrics } from './report/volumetrics/volumetricsReport';
import { generateSLARaport } from './report/SlaReport';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/logger/logger.service';
import { LogTaskType } from 'src/logger/dto/createLog';
import { LogStatus } from 'src/logger/dto/getLog';
import { ObjectId } from 'mongodb';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reports)
    private reportsRepository: Repository<Reports>,
    private jwtService: JwtService,
    private loggerService: LoggerService,
  ) {}

  async getBlockedReports(): Promise<Reports[]> | null {
    return this.reportsRepository.find({ where: { block: true } });
  }

  async getUserEmail(jwt: string): Promise<string> {
    const user = this.jwtService.decode(jwt.slice(7));
    return user.payload.email;
  }

  async getMorningReport(jwt: string) {
    this.blockReport('morning');
    const email = await this.getUserEmail(jwt);
    await generateMorningReport(
      email,
      this.loggerService,
      email.replace('@asseco.pl', ''),
    );
    this.unBlockReport('morning');
  }

  async generateSeleniumReport(jwt: string) {
    this.blockReport('selenium');
    const email = await this.getUserEmail(jwt);
    await generateSelenium(
      email,
      this.loggerService,
      email.replace('@asseco.pl', ''),
    );
    this.unBlockReport('selenium');
  }

  async generateVolumetricsReport(jwt: string) {
    this.blockReport('volumetrics');
    const email = await this.getUserEmail(jwt);
    await generateVolumetrics(
      email,
      this.loggerService,
      email.replace('@asseco.pl', ''),
    );
    this.unBlockReport('volumetrics');
  }

  async generateSLAReport(req: any, jwt: string) {
    this.blockReport('sla');
    const email = await this.getUserEmail(jwt);
    await generateSLARaport(
      req,
      email,
      this.loggerService,
      email.replace('@asseco.pl', ''),
    );
    this.unBlockReport('sla');
  }

  async blockReport(reportName: string): Promise<boolean> {
    const ReportFound = await this.reportsRepository.findOne({
      where: { name: reportName },
    });
    if (ReportFound === null) {
      const report = new Reports();
      report.block = true;
      report.name = reportName;
      await this.reportsRepository.insert(report);
      return true;
    } else {
      if (ReportFound.block === true) return false;
      else {
        await this.reportsRepository.update(
          { _id: ReportFound._id },
          { block: true },
        );
        return true;
      }
    }
  }

  async unBlockReport(reportName: string): Promise<boolean> {
    const ReportFound = await this.reportsRepository.findOne({
      where: { name: reportName },
    });
    if (ReportFound === null) {
      return false;
    } else {
      if (ReportFound.block === false) {
        return false;
      } else {
        await this.reportsRepository.update(
          { _id: ReportFound._id },
          { block: false },
        );
        return true;
      }
    }
  }

  @Cron('*/1 * * * *', {
    name: LogTaskType.UNBLOCK_REPORT,
  })
  async automaticUnblockReport() {
    const logId = await this.loggerService.createLog({
      task: LogTaskType.UNBLOCK_REPORT,
      status: LogStatus.OPEN,
    });
    const blockedReports = await this.getBlockedReports();
    const currentDate = new Date();
    if (blockedReports.length > 0) {
      blockedReports.forEach((report: Reports) => {
        let compareDate = report.updatedAt;
        compareDate.setMinutes(compareDate.getMinutes() + 130); // 10min+
        if (report.block === true && compareDate < currentDate) {
          this.reportsRepository.update({ _id: report._id }, { block: false });
          this.loggerService.createLog({
            taskId: logId,
            task: LogTaskType.UNBLOCK_REPORT,
            status: LogStatus.IN_PROGRESS,
            description: `automatic report ${report.name} unblock`,
          });
        }
      });
    }
    this.loggerService.createLog({
      taskId: logId,
      task: LogTaskType.UNBLOCK_REPORT,
      status: LogStatus.DONE,
    });
  }

  @Cron('45 5 * * *', {
    name: LogTaskType.MORNING_REPORT,
  })
  async automaticMorningReport() {
    generateMorningReport('esambo_hd@asseco.pl', this.loggerService, 'system');
  }

  @Cron('45 5 * * 6', {
    name: LogTaskType.VOLUMETRIC_REPORT,
  })
  async automaticVolumetricReport() {
    generateVolumetrics('esambo_hd@asseco.pl', this.loggerService, 'system');
  }
}
