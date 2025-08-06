import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './friendship.entity';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship])], // ✅ Required
  controllers: [FriendshipController],
  providers: [FriendshipService],
})
export class FriendshipModule {}
