import { Module } from '@nestjs/common';
import { GicaService } from './gica.service';
import { GicaController } from './gica.controller';
import { Gica } from './entities/gica.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Gica]), LoggerModule],
  providers: [GicaService],
  controllers: [GicaController],
})
export class GicaModule {}
