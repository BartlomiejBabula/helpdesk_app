import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshTokenGuard } from './refreshToken.guard';
import { CreateUserDto } from 'src/users/dto/createUser';
import { UsersService } from 'src/users/users.service';
import {
  ResetPasswordDto,
  SendEmailForgotPasswordDto,
} from './dto/resetPassword';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  logout(@Request() req) {
    return this.authService.logout(req.user.payload.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Request() req) {
    const userId = req.user.payload.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('forgot-password')
  sendEmailForgotPassword(
    @Body() sendEmailForgotPasswordDto: SendEmailForgotPasswordDto,
  ) {
    return this.authService.sendEmailForgotPassword(sendEmailForgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
