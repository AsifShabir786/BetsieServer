import { Controller, Get, Post, Body, Param,Query, Patch, Put } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
@ApiTags('Users') // 👈 For grouping in Swagger UI
@ApiBearerAuth()  // 👈 If you use JWT
 @Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.usersService.loginWithEmailPassword(body.email, body.password);
  }
  @Post('register')
  async register(@Body() body: any) {
    return this.usersService.create(body);
  }
  @Post('request-delete')
async requestDelete(@Body() body: { email: string }) {
  return this.usersService.requestAccountDeletion(body.email);
}
// users.controller.ts
@Put(':id/email')
async updateEmail(
  @Param('id') id: number,
  @Body('newEmail') newEmail: string,
) {
  return this.usersService.updateEmail(+id, newEmail);
}

@Patch(':id/player-name')
updatePlayerName(
  @Param('id') id: number,
  @Body('playerName') playerName: string,
) {
  return this.usersService.updatePlayerName(id, playerName);
}

@Get('confirm-delete')
async confirmDelete(@Query('token') token: string) {
  return this.usersService.confirmAccountDeletion(token);
}

@Get('search')
async searchUsers(
  @Query('id') id?: string,
  @Query('phoneNumber') phoneNumber?: string,
  @Query('playerName') playerName?: string,
  @Query('email') email?: string,
) {
  const query = {
    id: id ? parseInt(id, 10) : undefined,
    phoneNumber,
    playerName,
    email,
  };

  return this.usersService.searchUsers(query);
}
// get all players list route
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
// here route to get detail of speciifc player
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(+id);
  }
@Post('request-password-reset')
async requestReset(@Body('email') email: string) {
  return this.usersService.requestPasswordReset(email);
}

@Post('reset-password')
async resetPassword(
  @Body('token') token: string,
  @Body('newPassword') newPassword: string
) {
  return this.usersService.resetPassword(token, newPassword);
}

  @Post()
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

@Post('google-login')
async loginWithGoogle(
  @Body('accessToken') accessToken?: string,
  @Body('idToken') idToken?: string,
): Promise<{ user: User; token: string }> {
  return this.usersService.loginWithGoogle(accessToken, idToken);
}

@Post('facebook-login')
async loginWithFacebook(@Body('accessToken') accessToken: string): Promise<{ user: User; token: string }> {
  return this.usersService.loginWithFacebook(accessToken);
}

@Post('apple-login')
async loginWithApple(@Body('idToken') idToken: string): Promise<User> {
  return this.usersService.loginWithApple(idToken);
}

}
