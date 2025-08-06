// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  userType: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  rank: string;
  scored: number;
  totalGamesPlayed: number;
  playerName: number;

  totalWins: number;
  totalLoss: number;
  userRole: string;
  activeBets: number;
  completedBets: number;
  status: string;
}
