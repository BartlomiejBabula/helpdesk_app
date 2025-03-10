import { IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateThemeDto {
  @IsNotEmpty()
  @IsBoolean()
  darkTheme: boolean;
}
