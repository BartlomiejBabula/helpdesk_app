import { Module } from '@nestjs/common';
import { GicaService } from './gica.service';
import { GicaController } from './gica.controller';
import { Gica } from './entities/gica.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Gica])],
  providers: [GicaService],
  controllers: [GicaController],
})
export class GicaModule {}
