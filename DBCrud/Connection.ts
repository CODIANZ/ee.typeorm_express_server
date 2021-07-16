import { ConnectionOptions, createConnection, Connection } from "typeorm";
import { of, from } from "rxjs";
import { map } from "rxjs/operators";
import * as entity from "../src/entity";

export type dbConnectInfo_t = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  encrypt: boolean;
};

function buildDbConfig(): ConnectionOptions {
  return {
    type: "mysql",
    host: "localhost",
    port: 3333,
    username: "root",
    password: "testpass",
    database: "test",
    entities: entity.entities,
    synchronize: true,
    logging: "all",
  };
}

let defaultConnection: Connection | undefined;

export function dbDefaultConnection() {
  if (!defaultConnection) {
    return dbConnection().pipe(
      map((conn) => {
        defaultConnection = conn;
        return conn;
      })
    );
  } else {
    return of(defaultConnection);
  }
}

function dbConnection() {
  return from(createConnection(buildDbConfig()));
}
