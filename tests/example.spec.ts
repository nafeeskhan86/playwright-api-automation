import { test, expect, request } from "@playwright/test";

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

// test('Get all article', async({request})=>{
// const getArticleResp = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
// const getArticleRespJson = await getArticleResp.json();
// console.log(getArticleRespJson)
// }
// )

// test("Get all article", async ({ request }) => {
//   const queryParams = {
//     limit: 10,
//     offset: 0,
//   };
//   const getArticleResp = await request.get(
//     "https://conduit-api.bondaracademy.com/api/articles",
//     {
//       params: queryParams,
//     },
//   );
//   const getArticleRespJson = await getArticleResp.json();
//   console.log(getArticleRespJson);
//   expect(getArticleResp.status()).toEqual(200);
//   expect(getArticleRespJson.articles.length).toEqual(10);
// });

test("Get all article", async () => {
  const apiContext = await request.newContext();
  const queryParams = {
    limit: 10,
    offset: 0,
  };
  const getArticleResp = await apiContext.get(
    "https://conduit-api.bondaracademy.com/api/articles",
    {
      params: queryParams,
    },
  );
  const getArticleRespJson = await getArticleResp.json();
  console.log(getArticleRespJson);
  expect(getArticleResp.status()).toEqual(200);
  expect(getArticleRespJson.articles.length).toEqual(10);
});
