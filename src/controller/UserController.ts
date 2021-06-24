import { Post, Body, Controller, Req, Res } from "routing-controllers";
import * as entity from "../entity";
import { FindManyOptions, getRepository, Repository } from "typeorm";

let repository: Repository<entity.User | entity.Book>;

function setRepository<T extends entity.entity_name_t>(
  entityName: string
): Repository<entity.entity_map_t[T]> {
  return getRepository<entity.entity_map_t[T]>(entityName);
}

type req_base_t = {
  entity: keyof entity.entity_map_t;
};

type req_user_t = req_base_t & {
  entity: "User";
  query: FindManyOptions<entity.entity_map_t["User"]>;
};

type req_book_t = req_base_t & {
  entity: "Book";
  query: FindManyOptions<entity.entity_map_t["Book"]>;
};

type req_t = req_user_t | req_book_t;
type res_body_t = Promise<entity.User[]> | Promise<entity.Book[]>;
type res_t = { length: Promise<number>; body: res_body_t };

@Controller()
export class UserController {
  @Post("/")
  getAll(@Body() request: req_base_t) {
    const entity: string = request.entity;
    repository = setRepository(entity);
    return repository.find();
  }

  @Post("/list")
  getList(@Req() request: req_t, @Res() response: any) {
    const entity: string = request.entity;
    repository = setRepository(entity);
    const query: FindManyOptions = request.query;
    // return repository.find(query);
    response = {
      length: repository.count(),
      body: repository.find(query),
    };
    return response;
  }
}
