import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto, UserRoleType } from './dto/createUser';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateThemeDto } from './dto/updateTheme';
import { UserProfileType } from './dto/getProfile';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(CreateUserDto.password, salt);
    user.email = CreateUserDto.email;
    user.role = UserRoleType.HELPDESK;
    return this.usersRepository.save(user).catch((e) => {
      if (e.driverError.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Account with this email address already exists.',
        );
      }
      return e;
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByResetPasswordToken(
    resetPasswordToken: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({ where: { resetPasswordToken } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: parseInt(id) } });
  }

  async deleteById(id: number): Promise<string> {
    const user = await this.usersRepository.delete(id);
    if (user.affected === 0) return `No user with id: ${id}`;
    else return `Deleted user id: ${id}`;
  }

  async update(id: number, updateUserDto: any): Promise<any> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async updatePassword(id: number, password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(password, salt);
    this.usersRepository.update(id, { password: newPassword });
    this.usersRepository.update(id, { resetPasswordToken: null });
    return 'Password Updated';
  }

  async updateTheme(updateThemeDto: UpdateThemeDto): Promise<boolean> {
    await this.usersRepository.update(updateThemeDto.id, {
      darkTheme: updateThemeDto.darkTheme,
    });
    const user = await this.usersRepository.findOne({
      where: { id: updateThemeDto.id },
    });
    return user.darkTheme;
  }

  async getProfile(accessToken: string): Promise<UserProfileType> {
    const userToken = this.jwtService.decode(accessToken);
    const fetchedUser = await this.findById(userToken.payload.sub);
    const user: UserProfileType = {
      id: fetchedUser.id,
      email: fetchedUser.email,
      createdAt: fetchedUser.createdAt,
      updatedAt: fetchedUser.updatedAt,
      darkTheme: fetchedUser.darkTheme,
      role: fetchedUser.role,
    };
    return user;
  }
}
