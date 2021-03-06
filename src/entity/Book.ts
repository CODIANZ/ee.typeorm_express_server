import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  readonly id?: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column()
  publish_at!: Date;
}
