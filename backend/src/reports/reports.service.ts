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

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reports)
    private reportsRepository: Repository<Reports>,
    private jwtService: JwtService,
  ) {}

  async getBlockedReports(): Promise<Reports[]> | null {
    return this.reportsRepository.find({ where: { block: true } });
  }

  async getUserEmail(jwt): Promise<string> {
    const user = this.jwtService.decode(jwt.slice(7));
    return user.payload.email;
  }

  async generateMorningReport(jwt: string) {
    this.blockReport('morning');
    const email = await this.getUserEmail(jwt);
    await generateMorningReport(email);
    this.unBlockReport('morning');
  }

  async generateSeleniumReport(jwt: string) {
    this.blockReport('selenium');
    const email = await this.getUserEmail(jwt);
    await generateSelenium(email);
    this.unBlockReport('selenium');
  }

  async generateVolumetricsReport(jwt: string) {
    this.blockReport('volumetrics');
    const email = await this.getUserEmail(jwt);
    await generateVolumetrics(email);
    this.unBlockReport('volumetrics');
  }

  async generateSLAReport(req: any, jwt: string) {
    this.blockReport('sla');
    const email = await this.getUserEmail(jwt);
    await generateSLARaport(req, email);
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
      await this.reportsRepository.save(report);
      return true;
    } else {
      if (ReportFound.block === true) return false;
      else {
        await this.reportsRepository.update(
          { id: ReportFound.id },
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
      if (ReportFound.block === false) return false;
      else {
        await this.reportsRepository.update(
          { id: ReportFound.id },
          { block: false },
        );
        return true;
      }
    }
    return true;
  }

  @Cron('30 * * * * *')
  async automaticUnblockReport() {
    const blockedReports = await this.getBlockedReports();
    const currentDate = new Date();
    if (blockedReports.length > 0) {
      blockedReports.forEach((report: Reports) => {
        let compareDate = report.updatedAt;
        compareDate.setMinutes(compareDate.getMinutes() + 90);
        if (report.block === true && currentDate > compareDate) {
          console.log(`automatic report ${report.name} unblock`);
          this.reportsRepository.update({ id: report.id }, { block: false });
        }
      });
    }
  }

  @Cron('0 45 5 * * *')
  async automaticMorningReport() {
    console.log('automatic morning report');
    generateMorningReport('esambo_hd@asseco.pl');
  }

  @Cron('0 45 5 * * 6')
  async automaticVolumetricReport() {
    console.log('automatic volumetric report');
    generateVolumetrics('esambo_hd@asseco.pl');
  }
}
