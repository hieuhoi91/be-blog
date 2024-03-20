import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ name: 'user_id' })
  user_id: string;

  // @Column()
  // status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
