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
  creator: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  opponent: User;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'declined' | 'completed';

  @Column({ nullable: true })
  resolutionMethod: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
