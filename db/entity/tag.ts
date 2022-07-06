import { User, Article } from 'db/entity';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;
  @Column("varchar")
  title!: string;
  @Column("varchar")
  icon!: string;
  @Column("varchar")
  follow_count!: number;
  @Column("int")
  article_count!: number;
  @ManyToMany(() => User, {
    cascade: true
  })
  @JoinTable({
    name: 'tags_users_rel',
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'user_id'
    }
  })
  users!: User[];
  @ManyToMany(() => Article, (article) => article.tags)
  @JoinTable({
    name: 'articles_tags_rel',
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'article_id'
    }
  })
  articles!: Article[];
}
