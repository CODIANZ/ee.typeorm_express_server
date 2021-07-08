import { Book } from "./Book";
import { User } from "./User";
import { Role } from "./Role";

export * from "./Book";
export * from "./User";
export * from "./Role";

export type EntityMap = {
  User: User;
  Book: Book;
  Role: Role;
};
export type EntityName = keyof EntityMap;

export const entities = [User, Book, Role];

export const EntityNames: { [E in EntityName]: E } = {
  User: "User",
  Book: "Book",
  Role: "Role",
};
export const GetListTitle: {
  [E in EntityName]: () => string;
} = {
  User: () => "ユーザー",
  Book: () => "本",
  Role: () => "権限",
};
export function isEntity(s: unknown): s is EntityName {
  return typeof s === "string" && s in EntityNames;
}
