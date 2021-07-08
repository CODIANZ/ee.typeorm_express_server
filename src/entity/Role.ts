import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  readonly id?: number;

  @Column()
  role!: string;
}
