import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { CreateUserDto } from './dto/createUser';
import { UpdateThemeDto } from './dto/updateTheme';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Delete('delete/:id')
  deleteById(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req) {
    const accessToken = req.get('Authorization').replace('Bearer', '').trim();
    return this.userService.getProfile(accessToken);
  }

  @UseGuards(AccessTokenGuard)
  @Post('theme')
  updateDarkTheme(@Body() updateDarkTheme: UpdateThemeDto, @Req() req) {
    const accessToken = req.get('Authorization').replace('Bearer', '').trim();
    return this.userService.updateTheme(updateDarkTheme, accessToken);
  }

  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
