import { Book } from "./Book";
import { User } from "./User";

export * from "./Book";
export * from "./User";

export type entity_map_t = {
  User: User;
  Book: Book;
};
export type entity_name_t = keyof entity_map_t;

export const entity_names: { [E in entity_name_t]: E } = {
  User: "User",
  Book: "Book",
};

export function isEntity(s: unknown): s is entity_name_t {
  return typeof s === "string" && s in entity_names;
}

export const entities = [User, Book];
