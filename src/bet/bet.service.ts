import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet } from './bet.entity';
import { User } from '../users/user.entity';

@Injectable()
export class BetService {
  constructor(
    @InjectRepository(Bet)
    private betRepository: Repository<Bet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async requestBet(
    requesterId: number,
    receiverId: number,
    title: string,
    description: string | undefined,
    stake: number,
    resolutionMethod: string,
    expiresAt: Date
  ) {
    const requester = await this.userRepository.findOne({ where: { id: requesterId } });
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });

    if (!requester || !receiver) {
      throw new NotFoundException('Requester or Receiver not found');
    }

    const bet = this.betRepository.create({
      title,
      description: description ?? '',
      stake,
      creator: requester,
      opponent: receiver,
      resolutionMethod,
      expiresAt,
      status: 'pending',
    });

    return this.betRepository.save(bet);
  }

  async acceptBet(betId: number, receiverId: number) {
    const bet = await this.betRepository.findOne({
      where: { id: betId },
      relations: ['opponent'],
    });

    if (!bet) throw new NotFoundException('Bet not found');
    if (bet.opponent.id !== receiverId) {
      throw new BadRequestException('Only the invited opponent can accept this bet');
    }

    bet.status = 'accepted';
    return this.betRepository.save(bet);
  }

  async declineBet(betId: number, receiverId: number) {
    const bet = await this.betRepository.findOne({
      where: { id: betId },
      relations: ['opponent'],
    });

    if (!bet) throw new NotFoundException('Bet not found');
    if (bet.opponent.id !== receiverId) {
      throw new BadRequestException('Only the invited opponent can decline this bet');
    }

    bet.status = 'declined';
    return this.betRepository.save(bet);
  }

  // ✅ Fetch Pending Bets for a User
  async getPendingBets(userId: number) {
    return this.betRepository.find({
      where: [
        { creator: { id: userId }, status: 'pending' },
        { opponent: { id: userId }, status: 'pending' }
      ],
      relations: ['creator', 'opponent'],
    });
  }

  // ✅ Fetch Active Bets for a User
  async getActiveBets(userId: number) {
    return this.betRepository.find({
      where: [
        { creator: { id: userId }, status: 'accepted' },
        { opponent: { id: userId }, status: 'accepted' }
      ],
      relations: ['creator', 'opponent'],
    });
  }

  // ✅ Fetch Completed Bets for a User
  async getCompletedBets(userId: number) {
    return this.betRepository.find({
      where: [
        { creator: { id: userId }, status: 'completed' },
        { opponent: { id: userId }, status: 'completed' }
      ],
      relations: ['creator', 'opponent'],
    });
  }
}
