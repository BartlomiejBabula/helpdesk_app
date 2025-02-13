import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from './entities/logger.entity';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
  imports: [TypeOrmModule.forFeature([Logger]), JwtModule],
  exports: [LoggerService],
})
export class LoggerModule {}
