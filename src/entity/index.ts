import { FindManyOptions } from "typeorm";
import { Book } from "./Book";
import { User } from "./User";

export * from "./Book";
export * from "./User";

export type EntityMap = {
  User: User;
  Book: Book;
};
export type EntityName = keyof EntityMap;

export const entities = [User, Book];
export const entityNames: { [E in EntityName]: E } = {
  User: "User",
  Book: "Book",
};
export const GetListTitle: {
  [E in EntityName]: () => string;
} = {
  User: () => "ユーザー",
  Book: () => "本",
};
export function isEntity(s: unknown): s is EntityName {
  return typeof s === "string" && s in entityNames;
}

export type RequestBase = {
  entity: keyof EntityMap;
};

type RequestUser = RequestBase & {
  entity: "User";
  query: FindManyOptions<EntityMap["User"]>;
};

type RequestBook = RequestBase & {
  entity: "Book";
  query: FindManyOptions<EntityMap["Book"]>;
};

export type Request = RequestUser | RequestBook;
