import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BDate } from "@codianz/better-date";
import axios from "axios";
import { from, of, throwError } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { URLSearchParams } from "url";
import { AzureAuthServer } from "../test/AzureAuthServer";

const apiSettings = {
  clientID: "881fab39-5488-4d6a-927d-0dad6a784889",
  tenantID: "b233f6b1-68d6-45bf-a739-66ea5be95584",
  secretValue: "9GF2Ll-4.bGFWdfH.Gko8Z03P63Wu~oFLm",
};

type Token = {
  token_type: "Bearer";
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
  expires_at?: BDate;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://graph.microsoft.com/.default",
      client_id: apiSettings.clientID,
      client_secret: apiSettings.secretValue,
    });
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    // prettier-ignore
    from(AzureAuthServer(context, req))
    .pipe(mergeMap((auth) => {
        if(auth.extension_ReadAccount || auth.extension_WriteAccount) return of(void 0);
        else return throwError("!jobTitle");
      }))
      .pipe(mergeMap((x) => {
        return from(axios({
          method:"POST",
          url:`https://login.microsoftonline.com/${apiSettings.tenantID}/oauth2/v2.0/token`,
          data:params,
          headers
        })) 
      })).subscribe({
        next:(value) => {
          const token: Token = value.data;
          context.res = { body: token };
          resolve();
        },
        error:(err) => {reject(err);}
      })
  });
};

export default httpTrigger;
