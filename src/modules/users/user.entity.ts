import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from '../posts/post.entity';
import { CommentEntity } from '../comments/comment.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  refreshToken: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @Column({ default: 1 })
  status: number;

  @Column()
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comments) => comments.user)
  comments: CommentEntity[];
}
