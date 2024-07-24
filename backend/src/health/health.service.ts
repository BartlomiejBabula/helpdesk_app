import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}
  async CENHealthCheck() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://mantis.gitd.gov.pl'),
    ]);
  }
}
