import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity) private repo: Repository<UsersEntity>,
  ) {}

  createUser(user: CreateUserDto) {
    const users = this.repo.create(user);
    return this.repo.save(users);
  }

  findUser(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
