import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { CategoryEntity } from '../categories/category.entity';
import slugify from 'slugify';
import { CommentEntity } from '../comments/comment.entity';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: false })
  slug: string;

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

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.title, { lower: true });
  }

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

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];
}
