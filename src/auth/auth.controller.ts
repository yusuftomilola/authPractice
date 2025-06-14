import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { UsersService } from 'src/users/providers/users.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { GetCurrentUser } from './decorators/getCurrentUser.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    private readonly usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(
    // @Request() req: Express.Request,
    @Request() req,
    @GetCurrentUser() user: User,
  ) {
    console.log('The request is:', req);
    console.log('The user is:', user);
    return await this.authService.loginUser(user);
  }

  @Public()
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return await this.usersService.createUser(createUserDto);
  }
}
