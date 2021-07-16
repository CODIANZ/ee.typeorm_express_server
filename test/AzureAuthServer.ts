import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import passport from "passport";
import * as pad from "passport-azure-ad";

// prettier-ignore
export type server_setting_t = {
  clientId: string;       /** アプリケーション (クライアント) ID */
  tenantId: string;       /** ディレクトリ (テナント) ID */
  issuerDomain: string;   /** issuer domain */
  b2cDomain: string;      /** b2c domain */
  flowName: string;       /** ユーザーフロー名 */
  apiScopeName: string;   /** スコープ名 */
};

const settings: server_setting_t = {
  clientId:
    "881fab39-5488-4d6a-927d-0dad6a784889" /** アプリケーション (クライアント) ID */,
  tenantId:
    "b233f6b1-68d6-45bf-a739-66ea5be95584" /** ディレクトリ (テナント) ID */,
  issuerDomain: "codianzeval.b2clogin.com" /** issuer domain */,
  b2cDomain: "codianzeval.onmicrosoft.com" /** b2c domain */,
  flowName: "B2C_1_SIGNIN" /** ユーザーフロー名 */,
  apiScopeName: "auth" /** スコープ名 */,
};

const options = (setting: server_setting_t): pad.IBearerStrategyOption => {
  return {
    identityMetadata: `https://${setting.issuerDomain}/${setting.b2cDomain}/v2.0/.well-known/openid-configuration`,
    issuer: `https://${setting.issuerDomain}/${setting.tenantId}/v2.0/`,
    clientID: setting.clientId,
    validateIssuer: true,
    loggingLevel: "info",
    scope: ["openid", "profile", setting.apiScopeName],
    isB2C: true,
    policyName: setting.flowName,
    loggingNoPII: false,
  };
};

export function AzureAuthServer(context: Context, req: HttpRequest) {
  return new Promise<any>((resolve, reject) => {
    const bearerStrategy = new pad.BearerStrategy(
      options(settings),
      (token, done) => {
        done(null, "verified", token);
      }
    );
    passport.initialize();
    passport.use(bearerStrategy);

    const auth = passport.authenticate(
      "oauth-bearer",
      { session: false },
      (req, res, info) => {
        if (res === "verified") {
          resolve(info);
        } else {
          reject(info);
        }
      }
    );
    auth(context.req, context.req);
  });
}
