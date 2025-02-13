import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  //   Matches,
} from 'class-validator';

export enum UserRoleType {
  HELPDESK = 'helpdesk',
  CARREFOUR = 'carrefour',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(4)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  //   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //     message: 'password too weak',
  //   })
  password: string;
}
