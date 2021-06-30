import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  createConnection,
  FindManyOptions,
  getRepository,
  Repository,
} from "typeorm";
import * as entity from "../src/entity";

const connection = createConnection({
  type: "mysql",
  host: "localhost",
  port: 3333,
  username: "root",
  password: "testpass",
  database: "test",
  entities: entity.entities,
  synchronize: true,
  logging: "all",
});

const httpTrigger: AzureFunction = function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let repository: Repository<entity.User | entity.Book>;
    function setRepository<T extends entity.EntityName>(
      entityName: string
    ): Repository<entity.EntityMap[T]> {
      return getRepository<entity.EntityMap[T]>(entityName);
    }

    const entityName: string = req.query.entity!;
    const query: FindManyOptions = JSON.parse(req.query.query!);
    repository = setRepository(entityName);
    const _length = repository.count();
    const _body = repository.find(query);
    Promise.all([_length, _body])
      .then(([length, body]) => {
        context.res = {
          body: { length, body },
        };
        resolve();
      })
      .catch((err) => {
        context.res = {
          body: err,
        };
        resolve();
      });
  });
};

export default httpTrigger;
