import { Article, User } from 'db/entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;
  @Column("varchar")
  content!: string;
  @Column("datetime")
  create_time!: Date;
  @Column("datetime")
  update_time!: Date;
  @ManyToOne(() => User, {
    cascade: true
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @ManyToOne(() => Article, {
    cascade: true
  })
  @JoinColumn({ name: 'article_id' })
  article!: Article;
}
