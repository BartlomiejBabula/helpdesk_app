import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/users.entity';
import * as bcrypt from 'bcrypt';
import {
  ResetPasswordDto,
  SendEmailForgotPasswordDto,
} from './dto/resetPassword';
import { EMAIL, transporter } from 'src/nodemailer';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email address is incorrect');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async updateRefreshToken(userId: ObjectId, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: ObjectId, email: string) {
    const payload = { email: email, sub: userId };
    return {
      accessToken: this.jwtService.sign(
        {
          payload,
        },
        {
          secret: process.env.TOKEN,
          expiresIn: '15m',
        },
      ),
      refreshToken: this.jwtService.sign(
        {
          payload,
        },
        {
          secret: process.env.REFRESH_TOKEN,
          expiresIn: '3d',
        },
      ),
    };
  }

  async login(user: User) {
    const TOKENS = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, TOKENS.refreshToken);
    return TOKENS;
  }

  async logout(userId: ObjectId) {
    await this.usersService.update(userId, { refreshToken: null });
    return 'User has been logged out';
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const TOKENS = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, TOKENS.refreshToken);
    return TOKENS;
  }

  async sendEmailForgotPassword(
    sendEmailForgotPasswordDto: SendEmailForgotPasswordDto,
  ) {
    const user = await this.usersService.findByEmail(
      sendEmailForgotPasswordDto.email,
    );
    if (user) {
      const salt = await bcrypt.genSalt();
      const resetPasswordToken = Math.floor(Math.random() * 899999 + 100000);
      const hashedResetPasswordToken = await bcrypt.hash(
        resetPasswordToken.toString(),
        salt,
      );
      await this.usersService.update(user._id, {
        resetPasswordToken: hashedResetPasswordToken,
      });
      const resetPasswordLink = `https://esambohd.skg.pl/resetpassword/${hashedResetPasswordToken}`;
      transporter
        .sendMail({
          from: EMAIL,
          to: user.email,
          subject: 'Reset hasła w aplikacji helpdesk',
          html: `Cześć,<br><br>
  jeśli chcesz zresetować hasło do aplikacji kliknij na poniższy link<br><br>
  <p><a href=${resetPasswordLink}>Resetuj Hasło</a></p>`,
        })
        .then((info: any) => {})
        .catch(console.error);
      return 'Forgot password email send';
    } else {
      throw new BadRequestException('Cannot find email address');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByResetPasswordToken(
      resetPasswordDto.token,
    );
    if (user) {
      if (
        (await bcrypt.compare(resetPasswordDto.password, user.password)) ===
        true
      ) {
        throw new BadRequestException(
          `Couldn't change change password - new password is the same as old one`,
        );
      } else {
        await this.usersService.updatePassword(
          user._id,
          resetPasswordDto.password,
        );
        return 'Password has been reset';
      }
    } else throw new BadRequestException('Wrong token');
  }
}
