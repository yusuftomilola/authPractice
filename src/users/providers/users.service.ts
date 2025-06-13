import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/createUser.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { FindUserProvider } from './findUser.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly hashingProvider: HashingProvider,

    private readonly findUserProvider: FindUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName } = createUserDto;

    try {
      // check if user already exists
      const existingUser = await this.usersRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      // IF USER DOES NOT EXISTS

      // hash the new user's password
      const hashedPassword = await this.hashingProvider.hash(password);

      //create user instance
      const user = this.usersRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      // save user
      const newUser = await this.usersRepository.save(user);

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create user due to server error',
      );
    }
  }

  public async findUsers(): Promise<User[]> {
    try {
      const users = await this.usersRepository.find();

      if (!users || users.length <= 0) {
        throw new NotFoundException('Users not found');
      }

      return users;
    } catch (error) {
      throw new InternalServerErrorException('Error finding users');
    }
  }

  public async findSingleUser(id: string): Promise<User> {
    try {
      const user = await this.findUserProvider.findOneUserById(id);

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error finding user, please try again',
      );
    }
  }

  public async findUserByEmail(email: string) {
    return await this.findUserProvider.findOneUserByEmail(email);
  }

  public async findUserById(id: string) {
    return await this.findUserProvider.findOneUserById(id);
  }
}
