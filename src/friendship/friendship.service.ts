// src/friendship/friendship.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from './friendship.entity'; // ✅ make sure path is correct
import { User } from '../users/user.entity'; // ✅ make sure path is correct

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
  ) {}

  async sendRequest(requesterId: number, receiverId: number) {
    const existing = await this.friendshipRepository.findOne({
      where: {
        requester: { id: requesterId },
        receiver: { id: receiverId },
      },
    });

    if (existing) throw new Error('Request already sent.');

    const request = this.friendshipRepository.create({
      requester: { id: requesterId } as User,
      receiver: { id: receiverId } as User,
      status: 'pending',
    });

    return this.friendshipRepository.save(request);
  }
  async getPendingRequests(userId: number) {
  return this.friendshipRepository.find({
    where: {
      receiver: { id: userId },
      status: 'pending',
    },
    relations: ['requester'], // optional, if you want to return requester info
  });
}
async declineRequest(requesterId: number, receiverId: number) {
  const friendship = await this.friendshipRepository.findOne({
    where: {
      requester: { id: requesterId },
      receiver: { id: receiverId },
      status: 'pending',
    },
  });

  if (!friendship) {
    throw new Error('Friend request not found.');
  }

  friendship.status = 'rejected';
  return this.friendshipRepository.save(friendship);
}
 async unfriend(userId: number, friendId: number): Promise<any> {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { requester: { id: userId }, receiver: { id: friendId }, status: 'accepted' },
        { requester: { id: friendId }, receiver: { id: userId }, status: 'accepted' },
      ],
      relations: ['requester', 'receiver'],
    });

    if (!friendship) {
      throw new NotFoundException('Friendship not found.');
    }

    await this.friendshipRepository.remove(friendship);

    return { message: 'Unfriended successfully' };
  }


async acceptRequestByUsers(requesterId: number, receiverId: number) {
  const friendship = await this.friendshipRepository.findOne({
    where: {
      requester: { id: requesterId },
      receiver: { id: receiverId },
      status: 'pending',
    },
  });

  if (!friendship) {
    throw new Error('Friendship request not found.');
  }

  friendship.status = 'accepted';
  return this.friendshipRepository.save(friendship);
}

  async acceptRequest(friendshipId: number) {
    const friendship = await this.friendshipRepository.findOneBy({ id: friendshipId });
    if (!friendship || friendship.status !== 'pending') {
      throw new Error('Invalid request.');
    }

    friendship.status = 'accepted';
    return this.friendshipRepository.save(friendship);
  }

async getFriends(userId: number): Promise<User[]> {
  const friendships = await this.friendshipRepository.find({
    where: [
      { requester: { id: userId }, status: 'accepted' },
      { receiver: { id: userId }, status: 'accepted' },
    ],
    relations: ['requester', 'receiver'],
  });

  const friends: User[] = friendships.map(friendship => {
    return friendship.requester.id === userId
      ? friendship.receiver
      : friendship.requester;
  });

  return friends;
}

}
