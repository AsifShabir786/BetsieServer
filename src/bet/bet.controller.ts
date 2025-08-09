import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { BetService } from './bet.service';

@Controller('bets')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @Post('request')
  requestBet(@Body() body: {
    requesterId: number;
    receiverId: number;
    title: string;
    description?: string;
    stake: number;
    resolutionMethod: string;
    expiresAt: Date;
  }) {
    return this.betService.requestBet(
      body.requesterId,
      body.receiverId,
      body.title,
      body.description,
      body.stake,
      body.resolutionMethod,
      body.expiresAt
    );
  }

  @Post('accept')
  acceptBet(@Body() body: { betId: number; receiverId: number }) {
    return this.betService.acceptBet(body.betId, body.receiverId);
  }

  @Post('decline')
  declineBet(@Body() body: { betId: number; receiverId: number }) {
    return this.betService.declineBet(body.betId, body.receiverId);
  }

  @Get('pending/:userId')
  getPendingBets(@Param('userId') userId: number) {
    return this.betService.getPendingBets(userId);
  }

  @Get('active/:userId')
  getActiveBets(@Param('userId') userId: number) {
    return this.betService.getActiveBets(userId);
  }

  @Get('completed/:userId')
  getCompletedBets(@Param('userId') userId: number) {
    return this.betService.getCompletedBets(userId);
  }
}
