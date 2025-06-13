import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindUserProvider } from 'src/users/providers/findUser.provider';
import { HashingProvider } from './hashing.provider';
import { User } from 'src/users/entities/user.entity';
import { GenerateTokensProvider } from './generateTokens.provider';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async validateUser(email: string, userPassword: string) {
    const user = await this.usersService.findUserByEmail(email);

    let isPasswordEqual: boolean = false;

    try {
      isPasswordEqual = await this.hashingProvider.compare(
        userPassword,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException('Error connecting...');
    }

    if (!user) {
      throw new NotFoundException('Email/Password is not correct');
    }

    const { password, ...result } = user;

    return result;
  }

  public async loginUser(user: User) {
    const tokens = this.generateTokensProvider.generateBothTokens(user);

    return tokens;
  }
}
