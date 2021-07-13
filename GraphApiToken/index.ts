import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BDate } from "@codianz/better-date";
import axios from "axios";
import { URLSearchParams } from "url";

const apiSettings = {
  clientID: "eb302753-85e4-4f90-869d-8dc887dfc70c",
  tenantID: "b233f6b1-68d6-45bf-a739-66ea5be95584",
  secretValue: "Q9xeGJ3-SaujhfRa_PSnop2sx.r4~SyKl8",
};

type Token = {
  token_type: "Bearer";
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
  expires_at?: BDate;
};

let res: Promise<void>;
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  res = new Promise<void>(async (resolve, reject) => {
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://graph.microsoft.com/.default",
      client_id: apiSettings.clientID,
      client_secret: apiSettings.secretValue,
    });
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios
      .post(
        `https://login.microsoftonline.com/${apiSettings.tenantID}/oauth2/v2.0/token`,
        params,
        config
      )
      .then((value) => {
        const token: Token = value.data;
        token.expires_at = new BDate(Date.now()).addSeconds(
          token.expires_in - 1000
        );
        context.res = { body: token };
        resolve();
      })
      .catch((err) => {
        context.res = {
          body: err,
        };
        reject();
      });
  });
  return res;
};

export default httpTrigger;
