import "reflect-metadata";
import { createConnection } from "typeorm";
import { Book } from "./entity/Book";

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3333,
  username: "root",
  password: "testpass",
  database: "test",
  entities: [Book],
  synchronize: true,
  logging: "all",
})
  .then(async (connection) => {
    const randomNames: string[] = ["AA", "BB", "CC", "DD", "EE"];
    function randomDate(start: Date, end: Date) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    }

    const bookRepo = connection.getRepository(Book);
    for (let i = 0; i < 100; i++) {
      let book = new Book();
      book.title = randomNames[Math.floor(Math.random() * 5)];
      book.author = randomNames[Math.floor(Math.random() * 5)];
      book.publish_at = randomDate(new Date(2012, 0, 1), new Date());
      await bookRepo.save(book);
    }
  })
  .catch((error) => console.log("Error: ", error));
