import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt'; // ✅ Already imported

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    JwtModule.register({      // ✅ Add this to make JwtService available
      secret: 'your_jwt_secret', // 👈 Replace with env or actual secret
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
