import { test as base, expect } from "@playwright/test";
import { RequestHandler } from "./request-handler";
import { APILogger } from "./logger";
import { setCustomExpectLogger } from "./custom-expect";
import { config } from "../api-test.config";

export type Fixtures = {
  api: RequestHandler;
  config: typeof config;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    const logger = new APILogger();
    setCustomExpectLogger(logger);
    const requestHandler = new RequestHandler(request, config.apiUrl, logger);
    await use(requestHandler);
  },
  config: async ({}, use) => {
    await use(config);
  },
});
