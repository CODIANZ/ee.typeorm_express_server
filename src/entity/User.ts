import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  DeepPartial,
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

  @ManyToMany((type) => Role, { cascade: true })
  @JoinTable()
  roles?: Role[];
}

type a = DeepPartial<User>;

const u: User = {
  id: 3333,
  firstName: "",
  lastName: "",
  age: 33,
  roles: [
    {
      id: 3,
      role: "Read",
    },
  ],
};
