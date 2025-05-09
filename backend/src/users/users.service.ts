import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto, UserRoleType } from './dto/createUser';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateThemeDto } from './dto/updateTheme';
import { UserProfileType } from './dto/getProfile';
import { ObjectId } from 'mongodb';

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
    return this.usersRepository.insert(user).catch((e) => {
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
    const user = await this.usersRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    return user;
  }

  async deleteById(id: string): Promise<string> {
    const result = await this.usersRepository.delete({ _id: new ObjectId(id) });
    if (result.affected === 0) {
      return `No user with id: ${id}`;
    }
    return `Deleted user id: ${id}`;
  }

  async update(_id: ObjectId, updateUserDto: any): Promise<any> {
    return this.usersRepository.update(_id, updateUserDto);
  }

  async updatePassword(id: ObjectId, password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(password, salt);
    this.usersRepository.update(id, { password: newPassword });
    this.usersRepository.update(id, { resetPasswordToken: null });
    return 'Password Updated';
  }

  async updateTheme(
    updateThemeDto: UpdateThemeDto,
    accessToken: string,
  ): Promise<boolean> {
    const userToken = this.jwtService.decode(accessToken);
    await this.usersRepository.update(
      { _id: new ObjectId(userToken.payload.sub) },
      {
        darkTheme: updateThemeDto.darkTheme,
      },
    );
    const user = await this.usersRepository.findOne({
      where: { _id: new ObjectId(userToken.payload.sub) },
    });
    return user.darkTheme;
  }

  async getProfile(accessToken: string): Promise<UserProfileType> {
    const userToken = this.jwtService.decode(accessToken);
    const fetchedUser = await this.findById(userToken.payload.sub);
    const user: UserProfileType = {
      _id: new ObjectId(fetchedUser._id),
      email: fetchedUser.email,
      createdAt: fetchedUser.createdAt,
      updatedAt: fetchedUser.updatedAt,
      darkTheme: fetchedUser.darkTheme,
      role: fetchedUser.role,
    };
    return user;
  }
}
