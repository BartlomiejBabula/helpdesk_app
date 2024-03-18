import { IsNotEmpty, IsNumber } from 'class-validator';

export class RestartJobDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
