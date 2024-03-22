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
import { CategoryEntity } from '../categories/category.entity';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  thumbnail: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ name: 'category_id', nullable: true })
  category_id: string;
  // @Column()
  // status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, (categories) => categories.posts)
  @JoinColumn({ name: 'category_id' })
  categories: CategoryEntity;
}
