type req_base_t = {
  entity: entity.entity_name_t;
};

type req_user_t = req_base_t & {
  entity: "User";
  query: FindManyOptions<entity.entity_map_t["User"]>;
};

type req_book_t = req_base_t & {
  entity: "Book";
  query: FindManyOptions<entity.entity_map_t["Book"]>;
};

declare global {
  namespace Express {
    interface Request {
      ReqBody: req_user_t | req_book_t;
    }
    interface Response {
      ResBody: { length: number; body: {} };
    }
  }
}
