import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { LogTaskType } from 'src/logger/dto/createLog';

export class UpdateScheduleDto {
  @IsNotEmpty()
  @IsString()
  task: LogTaskType;

  @IsNotEmpty()
  @IsString()
  schedule: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsOptional()
  description: string;
}
