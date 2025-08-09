import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  stake: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  creator: User; // the one who created the bet

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  opponent: User; // the one who accepted the bet

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'declined';

  @Column({ nullable: true })
  resolutionMethod: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
