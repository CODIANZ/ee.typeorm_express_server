import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  createConnection,
  FindManyOptions,
  getRepository,
  Like,
  Repository,
} from "typeorm";
import * as entity from "../src/entity";

type OrderDesc = "ASC" | "DESC" | undefined;
type RequestOptions = {
  entityName?: entity.EntityName;
  orderby?: string;
  orderdesc?: OrderDesc;
  searchColumn?: entity.EntityName;
  searchText?: string;
  skip?: number;
  take?: number;
};
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

let repository: Repository<entity.User | entity.Book>;
function setRepository<T extends entity.EntityName>(
  entityName: string
): Repository<entity.EntityMap[T]> {
  return getRepository<entity.EntityMap[T]>(entityName);
}
let res: Promise<void>;
const httpTrigger: AzureFunction = function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  /**
   * CREATE
   */
  if (req.method === "POST") {
    res = new Promise<void>((resolve, reject) => {});
  }

  /**
   * READ
   */
  if (req.method === "GET") {
    res = new Promise<void>((resolve, reject) => {
      const request: RequestOptions = req.query;
      repository = setRepository(request.entityName!);
      const query: FindManyOptions = {
        where: request.searchColumn
          ? { [request.searchColumn]: Like(`%${request.searchText}%`) }
          : {},
        order: request.orderby ? { [request.orderby]: request.orderdesc } : {},
        skip: request.skip,
        take: request.take,
      };
      const _length = repository.count(query);
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
  }

  /**
   * UPDATE
   */
  // if (req.method === "PUT") {
  //   res = new Promise<void>((resolve, reject) => {
  //     const request = req.query;
  //     repository = setRepository(request.entityName!);
  //     const data = repository.findOne(request)

  //     const _update = repository.save(data);
  //     _update
  //       .then((value) => {
  //         context.res = {
  //           body: value,
  //         };
  //         resolve();
  //       })
  //       .catch((err) => {
  //         context.res = {
  //           body: err,
  //         };
  //         resolve();
  //       });
  //   });
  // }

  /**
   * DELETE
   */
  if (req.method === "DELETE") {
    res = new Promise<void>((resolve, reject) => {
      const request = req.query;
      repository = setRepository(request.entityName!);
      const query = { id: parseInt(request.deleteItem!) };
      const _delete = repository.delete(query);
      _delete
        .then((value) => {
          context.res = {
            body: value,
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
  }

  return res;
};

export default httpTrigger;
