import "reflect-metadata";
import { createConnection } from "typeorm";
import { createExpressServer } from "routing-controllers";
import { UserController } from "./controller/UserController";
import { User } from "./entity/User";
import { Book } from "./entity/Book";

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3333,
  username: "root",
  password: "testpass",
  database: "test",
  entities: [User, Book],
  synchronize: true,
  logging: "all",
})
  .then(async (connection) => {
    createExpressServer({
      cors: true,
      controllers: [UserController],
    }).listen(3000);
    console.log("Server is up and running on port 3000.");
  })
  .catch((error) => console.log("Error: ", error));
