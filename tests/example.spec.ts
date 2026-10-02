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

test("Create and Delete Article", async ({}) => {
  const apiContext = await request.newContext();
  const queryParams = {
    limit: 10,
    offset: 0,
  };
  const authResponse = await apiContext.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: {
          email: "nafees.mca07@gmail.com",
          password: "khan1234",
        },
      },
    },
  );
  const authRespJson = await authResponse.json();
  const authToken = "Token" + " " + authRespJson.user.token;
  console.log(authToken);
  const postArticleResp = await apiContext.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      headers: {
        Authorization: authToken,
      },
      data: {
        article: {
          title: "test8",
          description: "test desc",
          body: "test body",
          tagList: ["playwright"],
        },
      },
    },
  );
  const postArticleRespjson = await postArticleResp.json();
  console.log(postArticleRespjson);
  const slugID = postArticleRespjson.article.slug;
  console.log(slugID);
  const getArticleResp = await apiContext.get(
    "https://conduit-api.bondaracademy.com/api/articles",
    {
      params: queryParams,
      headers: {
        Authorization: authToken,
      },
    },
  );
  const getArticleRespJson = await getArticleResp.json();
  expect(getArticleRespJson.articles[0].title).toEqual("test8");

  const deleteResponse = await apiContext.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`,
    {
      headers: {
        Authorization: authToken,
      }
    }
  )
  expect(deleteResponse.status()).toEqual(204);
})