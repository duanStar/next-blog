import { User, Comment, Tag } from 'db/entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'articles' })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;
  @Column("varchar")
  title!: string;
  @Column("varchar")
  content!: string;
  @Column("int")
  views!: number;
  @Column("datetime")
  create_time!: Date;
  @Column("datetime")
  update_time!: Date;
  @Column("bit")
  is_delete!: number;
  @ManyToOne(() => User, {
    cascade: true
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @OneToMany(() => Comment, (comment) => comment.article)
  comments!: Comment[];
  @ManyToMany(() => Tag, (tag) => tag.articles, {
    cascade: true
  })
  tags!: Tag[];
}
