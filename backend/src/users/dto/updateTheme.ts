import { IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class UpdateThemeDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsBoolean()
  darkTheme: boolean;
}
