import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { PageOptionsDto } from 'src/dtos/page.option.dto';
import { PageDto } from 'src/dtos/page.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllPosts(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    return await this.usersService.getAllUsers(pageOptionsDto);
  }
  @Get('/:id')
  findUser(@Param('id') id: string) {
    const user = this.usersService.findUser(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
