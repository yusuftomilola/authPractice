import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { UsersService } from 'src/users/providers/users.service';
import { IsPublic } from './decorators/public.decorator';
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

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(
    // @Request() req: Express.Request,
    // @Req() req: Request
    @GetCurrentUser() user: User,
  ) {
    return await this.authService.loginUser(user);
  }

  @IsPublic()
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return await this.usersService.createUser(createUserDto);
  }
}
