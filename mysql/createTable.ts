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
    "CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `role` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
  );
  await connection.query(
    "CREATE TABLE `book` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `author` varchar(255) NOT NULL, `publish_at` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
  );
  await connection.query(
    "CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `age` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
  );
  await connection.query(
    "CREATE TABLE `user_roles_role` (`userId` int NOT NULL, `roleId` int NOT NULL, INDEX `IDX_5f9286e6c25594c6b88c108db7` (`userId`), INDEX `IDX_4be2f7adf862634f5f803d246b` (`roleId`), PRIMARY KEY (`userId`, `roleId`)) ENGINE=InnoDB"
  );
  await connection.query(
    "ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE"
  );
  await connection.query(
    "ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE"
  );
  await connection.close();
});
