import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class SendEmailForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(4)
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
