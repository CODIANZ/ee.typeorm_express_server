import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Role } from "./Role";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id?: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  age!: number;

  @ManyToMany((type) => Role)
  @JoinTable()
  roles?: Role[];
}
