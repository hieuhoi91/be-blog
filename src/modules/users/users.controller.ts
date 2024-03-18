import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { LocalAuthGuard } from '../auth/guard/local.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Get('all')
  findAllUsers(): Promise<UsersEntity[]> {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    const user = this.usersService.findUser(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}
