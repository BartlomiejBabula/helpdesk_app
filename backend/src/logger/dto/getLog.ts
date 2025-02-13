import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum LogStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class GetLogFilterDto {
  @IsOptional()
  @IsEnum(LogStatus)
  status?: LogStatus;

  @IsOptional()
  @IsString()
  task: string;

  @IsOptional()
  @IsString()
  orderedBy: string;

  @IsOptional()
  @IsString()
  taskId: string;
}
