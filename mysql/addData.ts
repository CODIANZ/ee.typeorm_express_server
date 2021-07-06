import "reflect-metadata";
import { createConnection } from "typeorm";
import * as entity from "../src/entity";

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3333,
  username: "root",
  password: "testpass",
  database: "test",
  entities: entity.entities,
  synchronize: true,
  logging: "all",
})
  .then(async (connection) => {
    const randomNames: string[] = ["AA", "BB", "CC", "DD", "EE"];
    const roles: string[] = ["Read", "Write", "Execute"];
    function randomDate(start: Date, end: Date) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    }

    const roleRepo = connection.getRepository(entity.Role);
    for (let i = 0; i < 3; i++) {
      let role = new entity.Role();
      role.role = roles[i];
      await roleRepo.save(role);
    }
    const userRepo = connection.getRepository(entity.User);
    for (let i = 0; i < 300; i++) {
      let user = new entity.User();
      user.age = Math.floor(Math.random() * 100);
      user.firstName = randomNames[Math.floor(Math.random() * 5)];
      user.lastName = randomNames[Math.floor(Math.random() * 5)];
      await userRepo.save(user);
    }

    const bookRepo = connection.getRepository(entity.Book);
    for (let i = 0; i < 99; i++) {
      let book = new entity.Book();
      book.title = randomNames[Math.floor(Math.random() * 5)];
      book.author = randomNames[Math.floor(Math.random() * 5)];
      book.publish_at = randomDate(new Date(2012, 0, 1), new Date());
      await bookRepo.save(book);
    }
  })
  .catch((error) => console.log("Error: ", error));
