import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserReq, CreateUserRes } from './dtos/create-user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async createUser(userRegister: CreateUserReq): Promise<CreateUserRes> {
    const findUser = await this.usersRepository.findOneBy({
      email: userRegister.email,
    });

    if (findUser) {
      throw new ConflictException(`User ${userRegister.email} already exists`);
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(userRegister.password, saltRounds);
    userRegister.password = hashPassword;

    const user = this.usersRepository.create(userRegister);
    return { ...(await this.usersRepository.save(user)) };
  }

  findUser(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    return user;
  }
}
