import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Friendship } from '../friendship/friendship.entity'; // Make sure this path is correct

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userType: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  deleteAccountToken: string;

  @Column({ nullable: true })
  deleteTokenExpires: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetTokenExpires: Date;

  @Column({ nullable: true })
  playerName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  rank: string;

  @Column({ nullable: true })
  scoredPoints: number;

  @Column({ nullable: true })
  totalGamesPlayed: number;

  @Column({ nullable: true })
  totalGamesWon: number;

  @Column({ nullable: true })
  totalGamesLost: number;

  @Column({ nullable: true })
  totalGamesDrawn: number;

  @Column({ nullable: true })
  totalGamesAbandoned: number;

  @Column({ nullable: true })
  userRole: string;

  @Column({ nullable: true })
  ActiveBets: number;

  @Column({ nullable: true })
  totalBets: number;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  FullName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  isActive: boolean;

  @Column({ nullable: true })
  isVerified: boolean;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  status: string;

  // ✅ ADD THESE RELATIONS
  @OneToMany(() => Friendship, friendship => friendship.requester)
  sentRequests: Friendship[];

  @OneToMany(() => Friendship, friendship => friendship.receiver)
  receivedRequests: Friendship[];
}
