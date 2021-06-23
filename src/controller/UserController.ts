import { Post, JsonController, Body } from "routing-controllers";
import * as entity from "../entity";
import { FindManyOptions, getRepository, Repository } from "typeorm";

let repository: Repository<entity.User | entity.Book>;

function setRepository<T extends entity.entity_name_t>(
  repo: string
): Repository<entity.entity_map_t[T]> {
  return getRepository<entity.entity_map_t[T]>(repo);
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

// function executeQuery<T extends keyof entity.entity_map_t>(
//   entity: T,
//   query: FindManyOptions<entity.entity_map_t[T]>
// ) {}

@JsonController()
export class UserController {
  @Post("/")
  getAll(@Body() request: req_t) {
    // if (request.entity == "User") {
    //   executeQuery(request.entity, request.query);
    // } else if (request.entity == "Book") {
    //   executeQuery(request.entity, request.query);
    // }
    const entity: string = request.entity;
    repository = setRepository(entity);
    const query: FindManyOptions = request.query;
    // if (!query) return repository.find();
    return repository.find(query);
  }

  // @Post("/list")
  // postQuery(@Body() query: FindManyOptions) {
  //   return repository.find(query);
  // }
}
