import { test, expect } from "@playwright/test";

test("get test tags", async ({ request }) => {
  const tagsResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags",
  );
  const tagsResponseJson = await tagsResponse.json();
  console.log(tagsResponseJson);
  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJson.tags[0]).toEqual("Test");
  expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10);
  expect(tagsResponseJson).toHaveProperty("tags");
});
