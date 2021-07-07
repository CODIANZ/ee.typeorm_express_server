import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  createConnection,
  FindManyOptions,
  getRepository,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from "typeorm";
import * as entity from "../src/entity";

export type RequestBase = {
  entityName?: entity.EntityName;
  relations?: string;
};
export type FindRequestOptions = RequestBase & {
  orderby?: string;
  orderdesc?: "ASC" | "DESC" | undefined;
  searchColumn?: entity.EntityName;
  searchType?: string;
  searchText?: string;
  skip?: number;
  take?: number;
};
export type DeleteRequestOptions = RequestBase & {
  deleteItem: string;
};
export type SaveRequestOptions = RequestBase & {};

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
createConnection();
let repository: Repository<entity.User | entity.Book>;

const createWhere = (column: entity.EntityName, text: string, type: string) => {
  let query;
  switch (type) {
    case "Equal":
      query = { [column]: text };
      break;
    case "Like":
      query = { [column]: Like(`%${text}%`) };
      break;
    case "Not":
      query = { [column]: Not(text) };
      break;
    case "LessThan":
      query = { [column]: LessThan(text) };
      break;
    case "LessThanOrEqual":
      query = { [column]: LessThanOrEqual(text) };
      break;
    case "MoreThan":
      query = { [column]: MoreThan(text) };
      break;
    case "MoreThanOrEqual":
      query = { [column]: MoreThanOrEqual(text) };
      break;
    default:
      query = {};
  }
  return query;
};

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
    res = new Promise<void>((resolve, reject) => {
      const request = req.body;
      repository = setRepository(request.entityName!);
      const _row = repository.create(request.data);
      const _create = repository.save(_row);
      _create
        .then(() => resolve())
        .catch((err) => {
          context.res = {
            body: err,
          };
          reject();
        });
    });
  }

  /**
   * READ
   */
  if (req.method === "GET") {
    res = new Promise<void>((resolve, reject) => {
      const request: FindRequestOptions = req.query;
      repository = setRepository(request.entityName!);
      const query: FindManyOptions = {
        relations: request.relations
          ? Object.values(JSON.parse(request.relations))
          : [],
        // prettier-ignore
        where: request.searchColumn
          ? createWhere(request.searchColumn,request.searchText!,request.searchType!)
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
          reject();
        });
    });
  }

  /**
   * UPDATE
   */
  if (req.method === "PUT") {
    res = new Promise<void>((resolve, reject) => {
      const request = req.body;
      repository = setRepository(request.entityName!);
      const _row = repository.findOne({ id: request.data.id });
      _row
        .then((row) => {
          row = request.data;
          // prettier-ignore
          repository.save(row!)
            .then(() => resolve())
            .catch((err) => {
              context.res = {
                body: err,
              };
              reject();
            });
        })
        .catch((err) => {
          context.res = {
            body: err,
          };
          reject();
        });
    });
  }

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
          reject();
        });
    });
  }

  return res;
};

export default httpTrigger;
