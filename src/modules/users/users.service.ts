import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/dtos/page.option.dto';
import { PageMetaDto } from 'src/dtos/page.meta.dto';
import { PageDto } from 'src/dtos/page.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers(pageOptionsDto: PageOptionsDto) {
    try {
      const queryBuilder = this.usersRepository.createQueryBuilder('users');

      queryBuilder
        .select([
          'users.id',
          'users.username',
          'users.email',
          'users.created_at',
          'users.updated_at',
          'users.avatar',
          'users.role',
          // Add other fields you need here
        ])
        .orderBy('users.created_at', pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  findUser(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    return user;
  }

  @UseGuards(JwtAuthGuard)
  deleteUser(user_id: string) {
    return this.usersRepository.delete(user_id);
  }
}
