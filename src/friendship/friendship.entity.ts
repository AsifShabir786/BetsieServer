import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.sentRequests, { onDelete: 'CASCADE' })
  requester: User;

  @ManyToOne(() => User, user => user.receivedRequests, { onDelete: 'CASCADE' })
  receiver: User;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';
}
