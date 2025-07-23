import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  // ✅ NEW: Google login endpoint
  @Post('google-login')
  async loginWithGoogle(@Body('accessToken') accessToken: string): Promise<User> {
    return this.usersService.loginWithGoogle(accessToken);
  }
  @Post('facebook-login')
async loginWithFacebook(@Body('accessToken') accessToken: string): Promise<User> {
  return this.usersService.loginWithFacebook(accessToken);
}
@Post('apple-login')
async loginWithApple(@Body('idToken') idToken: string): Promise<User> {
  return this.usersService.loginWithApple(idToken);
}

}
