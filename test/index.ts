import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { from } from "rxjs";
import { AzureAuthServer } from "./AzureAuthServer";

const httpTrigger: AzureFunction = function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  return new Promise<void>((resolve, reject) => {});
};

export default httpTrigger;
