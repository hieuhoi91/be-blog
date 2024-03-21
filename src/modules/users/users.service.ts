import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    console.log(process.env.SSL);

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
