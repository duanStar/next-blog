import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;
  @Column("varchar")
  nickname!: string;
  @Column("varchar")
  avatar!: string;
  @Column("varchar")
  job!: string;
  @Column("varchar")
  introduce!: string;
}
