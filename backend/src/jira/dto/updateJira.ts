import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class UpdateJiraDto {
  @IsNotEmpty()
  @IsBoolean()
  auto: boolean;

  @IsNotEmpty()
  @IsString()
  jiraKey: string;
}
