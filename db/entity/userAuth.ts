import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './user';

@Entity({ name: 'user_auths' })
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;
  @ManyToOne(() => User, {
    cascade: true
  })
  @JoinColumn({
    name: 'user_id'
  })
  user!: User
  @Column("varchar")
  identity_type!: string;
  @Column("varchar")
  identifier!: string;
  @Column("varchar")
  credential!: string;
}
