import { RequestHandler } from "../Utils/request-handler";
import { APILogger } from "../Utils/logger";
import { config } from "../api-test.config";
import { request } from "@playwright/test";

export async function createToken(
  email: string,
  password: string,
): Promise<string> {
  const context = await request.newContext();
  const logger = new APILogger();
  const api = new RequestHandler(context, config.apiUrl, logger);
  try {
    const authResponse = await api
      .path("/users/login")
      .body({
        user: {
          email: email,
          password: password,
        },
      })
      .postRequest(200);
    const authToken = "Token " + authResponse.user.token;
    return authToken;
  } catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace(error, createToken);
    }
    throw error;
  } finally {
    await context.dispose();
  }
}
