import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from './bet.entity';
import { BetService } from './bet.service';
import { BetController } from './bet.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bet, User])],
  controllers: [BetController],
  providers: [BetService],
})
export class BetModule {}
