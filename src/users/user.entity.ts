import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

@Column({ nullable: true })
userType: string;

@Column({ nullable: true })
email: string;

@Column({ nullable: true })
phoneNumber:string;
@Column({ nullable: true }      )
address:string;
@Column({ nullable: true }      )
rank:string;
@Column({ nullable: true }      )
scoredPoints: number;
@Column({ nullable: true }      )

totalGamesPlayed: number;
@Column({ nullable: true }      )

totalGamesWon: number;
@Column({ nullable: true }      )

totalGamesLost: number;
@Column({ nullable: true }      )

totalGamesDrawn: number;
@Column({ nullable: true }      )

totalGamesAbandoned: number; 
@Column({ nullable: true }      )

userRole: string; // 'admin' | 'user'
@Column({ nullable: true }      )

ActiveBets: number;
@Column({ nullable: true }      )

totalBets: number;
@Column({ nullable: true }      )

createdAt: Date;
@Column({ nullable: true }      )

updatedAt: Date;
@Column({ nullable: true }      )

FullName: string;
@Column({ nullable: true }      )

password: string;
@Column({ nullable: true }      )

isActive: boolean;
@Column({ nullable: true }      )

isVerified: boolean;    
@Column({ nullable: true }      )

lastLogin: Date;
@Column({ nullable: true })
profilePicture: string; // URL or path to the profile picture
@Column({ nullable: true }      )

status: string; // e.g., 'online', 'offline', 'away'
}