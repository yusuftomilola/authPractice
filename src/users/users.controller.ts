import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { GetCurrentUser } from 'src/auth/decorators/getCurrentUser.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async getUsers() {
    return await this.usersService.findUsers();
  }

  @Get('profile')
  public async getCurrentUserProfile(@GetCurrentUser() currentUser: User) {
    return currentUser;
  }
}
