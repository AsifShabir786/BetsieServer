 import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { FriendshipService } from './friendship.service';   
@Controller('friendship')
export class FriendshipController {
    constructor(private readonly friendshipService: FriendshipService) {}
    @Post('request')
sendFriendRequest(@Body() body: { requesterId: number; receiverId: number }) {
  return this.friendshipService.sendRequest(body.requesterId, body.receiverId);
}
@Post('accept')
acceptFriendRequest(@Body() body: { requesterId: number; receiverId: number }) {
  return this.friendshipService.acceptRequestByUsers(body.requesterId, body.receiverId);
}
@Delete('unfriend')
unfriend(
  @Query('userId') userId: number,
  @Query('friendId') friendId: number,
) {
  return this.friendshipService.unfriend(userId, friendId);
}
@Post('decline')
declineFriendRequest(@Body() body: { requesterId: number; receiverId: number }) {
  return this.friendshipService.declineRequest(body.requesterId, body.receiverId);
}
@Get('pending/:userId')
getPendingRequests(@Param('userId') userId: number) {
  return this.friendshipService.getPendingRequests(userId);
}
@Get('friends/:userId')
getFriends(@Param('userId') userId: number) {
  return this.friendshipService.getFriends(userId);
}
}
