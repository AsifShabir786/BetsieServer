import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ✅ Import TypeOrmModule
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity'; // ✅ Import User entity

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ✅ Register User entity
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
