import { Post, JsonController, Body } from "routing-controllers";
import * as entity from "../entity";
import { FindManyOptions, getRepository, Repository } from "typeorm";

let repository: Repository<entity.User | entity.Book>;

function setRepository<T extends entity.entity_name_t>(
  repo: string
): Repository<entity.entity_map_t[T]> {
  return getRepository<entity.entity_map_t[T]>(repo);
}

@JsonController()
export class UserController {
  @Post("/")
  getAll(@Body() request: any) {
    const entity: string = request.entity;
    repository = setRepository(entity);
    return repository.find({});
  }

  @Post("/list")
  postQuery(@Body() query: FindManyOptions) {
    return repository.find(query);
  }
}
