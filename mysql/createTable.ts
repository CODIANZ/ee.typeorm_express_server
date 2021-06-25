import "reflect-metadata";
import { createConnection } from "typeorm";

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3333,
  username: "root",
  password: "testpass",
  logging: "all",
}).then(async (connection) => {
  await connection.query("CREATE DATABASE IF NOT EXISTS test;");
  await connection.query("USE test;");
  await connection.query(
    "CREATE TABLE `book` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `author` varchar(255) NOT NULL, `publish_at` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
  );
  await connection.query(
    "CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `age` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
  );
  await connection.close();
});
