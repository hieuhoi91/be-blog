import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async getAllUsers() {
    return await this.usersRepository.find({
      select: [
        'id',
        'username',
        'email',
        'avatar',
        'status',
        'created_at',
        'updated_at',
      ],
    });
  }

  findUser(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    return user;
  }
}
