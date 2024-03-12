import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserReq } from './dtos/create-user';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  findUser(@Param('id') id: string) {
    const user = this.usersService.findUser(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}
