import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneUserById(id: string): Promise<User> {
    let user: User;

    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find user from the database due to server error',
      );
    }

    if (!user) {
      throw new NotFoundException('User not found/does not exist');
    }

    return user;
  }

  public async findOneUserByEmail(email: string): Promise<User> {
    let user: User = null;

    try {
      user = await this.usersRepository.findOneBy({ email: email });
    } catch (error) {
      throw new RequestTimeoutException('Error connecting to the database');
    }

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }
}
