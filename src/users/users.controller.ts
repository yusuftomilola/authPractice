import { Controller, Get } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { GetCurrentUser } from 'src/auth/decorators/getCurrentUser.decorator';
import { User } from './entities/user.entity';

@Controller('users')
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
