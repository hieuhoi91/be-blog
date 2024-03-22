import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from '../posts/post.entity';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  // @Column()
  // posts: string[];

  @OneToMany(() => PostEntity, (post) => post.categories)
  // @JoinColumn({ name: 'posts' })
  posts: PostEntity[];

  @Column()
  slug: string;
}
