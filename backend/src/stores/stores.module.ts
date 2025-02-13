import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stores } from './entities/stores.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
  imports: [TypeOrmModule.forFeature([Stores]), LoggerModule],
})
export class StoresModule {}
