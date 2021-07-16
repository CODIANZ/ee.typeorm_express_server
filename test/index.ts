import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  return new Promise<void>((resolve, reject) => {});
};

export default httpTrigger;
