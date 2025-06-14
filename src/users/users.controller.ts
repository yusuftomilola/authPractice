import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { GetCurrentUser } from 'src/auth/decorators/getCurrentUser.decorator';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/enums/roles.enum';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.RMS)
  public async getUsers() {
    return await this.usersService.findUsers();
  }

  @Get('profile')
  @Roles(UserRole.RMS)
  public async getCurrentUserProfile(@GetCurrentUser() currentUser: User) {
    return currentUser;
  }
}
