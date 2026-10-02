import { test as base, expect } from "@playwright/test";
import { RequestHandler } from "./request-handler";

export type Fixtures = {
  api: RequestHandler;
};

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const requestHandler = new RequestHandler();
    await use(requestHandler);
  },
});
