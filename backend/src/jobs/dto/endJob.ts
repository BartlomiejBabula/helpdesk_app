import { IsNotEmpty, IsNumber } from 'class-validator';

export class EndJobDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
