import { Controller, Get, UseGuards } from '@nestjs/common';
import { GicaService } from './gica.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';

@Controller('gica')
export class GicaController {
  constructor(private readonly gicaService: GicaService) {}

  @UseGuards(AccessTokenGuard)
  @Get('')
  getGicaData() {
    return this.gicaService.getGica();
  }
}
