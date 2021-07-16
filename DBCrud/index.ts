import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  Connection,
  FindManyOptions,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from "typeorm";
import { BehaviorSubject, from, NEVER, Observable, of, throwError } from "rxjs";
import { mergeMap, take } from "rxjs/operators";
import { AzureAuthServer } from "../common/AzureAuthServer";
import * as entity from "../src/entity";
import { dbDefaultConnection } from "../common/Connection";

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

let repository: Repository<entity.User | entity.Book | entity.Role>;

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

const DefaultConnection = new BehaviorSubject<Connection | undefined>(
  undefined
);

let res: Promise<void>;
const httpTrigger: AzureFunction = function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  /**
   * READ
   */
  if (req.method === "GET") {
    res = new Promise<void>((resolve, reject) => {
      // prettier-ignore
      from(AzureAuthServer(context, req))
      .pipe(mergeMap((auth) => {
        if(auth.extension_ReadBook) return of(void 0);
        else return throwError("Permission Error");
      })).pipe(mergeMap(() => {
        return (dbDefaultConnection()
        .pipe(mergeMap((conn) => {
          const request: FindRequestOptions = req.query;
          const query: FindManyOptions = {
            relations: request.relations
              ? Object.values(JSON.parse(request.relations))
              : [],
            where: request.searchColumn
              ? createWhere(request.searchColumn,request.searchText!,request.searchType!)
              : {},
            order: request.orderby ? { [request.orderby]: request.orderdesc } : {},
            skip: request.skip,
            take: request.take,
          };
          repository = conn.getRepository(request.entityName!);
          const _length = repository.count(query);
          const _body = repository.find(query);
          return from(Promise.all([_length, _body]))
        }))
      )}))
      .subscribe({
        next:([length, body]) => {
          context.res = {body: { length, body }};
          resolve();
        },
        error:(err) => {reject(err);}
      })
    });
  }

  /**
   * UPDATE,CREATE
   */
  if (req.method === "POST") {
    res = new Promise<void>((resolve, reject) => {
      // prettier-ignore
      from(AzureAuthServer(context, req))
      .pipe(mergeMap((auth) => {
        if(auth.extension_WriteBook) return of(void 0);
        else return throwError("Permission Error");
      })).pipe(mergeMap(() => {
        return dbDefaultConnection()
        .pipe(mergeMap((conn) => {
          const request = req.body;
          repository = conn.getRepository(request.entityName!);
          return from(repository.save(request.data))
        }))
      }))
      .subscribe({
        next:() => {
          resolve();
        },
        error:(err) => {reject(err);}
      })
    });
  }

  /**
   * DELETE
   */
  if (req.method === "DELETE") {
    res = new Promise<void>((resolve, reject) => {
      // prettier-ignore
      from(AzureAuthServer(context, req))
      .pipe(mergeMap((auth) => {
        if(auth.extension_WriteBook) return of(void 0);
        else return throwError("Permission Error");
      })).pipe(mergeMap(() => {
        return dbDefaultConnection()
        .pipe(mergeMap((conn) => {
          const request = req.query;
          repository = conn.getRepository(request.entityName!);
          const query = { id: parseInt(request.deleteItem!) };
          return from(repository.delete(query))
        }))
      }))
      .subscribe({
        next:(value) => {
          context.res = {body:value};
          resolve();
        },
        error:(err) => {reject(err);}
      })
    });
  }
  return res;
};

export default httpTrigger;
