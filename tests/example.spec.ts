import { test, expect, request } from "@playwright/test";

let authToken: string;

test.beforeAll("Run this before all tests", async ({ request }) => {
  const authResponse = await request.post(
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
  authToken = "Token" + " " + authRespJson.user.token;
});

test("get test tags", async ({ request }) => {
  const tagsResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags",
  );
  const tagsResponseJson = await tagsResponse.json();
  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJson.tags[0]).toEqual("Test");
  expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10);
  expect(tagsResponseJson).toHaveProperty("tags");
});

test("Get all article", async ({ request }) => {
  const getArticleResp = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles",
    {
      params: {
        limit: 10,
        offset: 0,
      },
    },
  );
  const getArticleRespJson = await getArticleResp.json();
  expect(getArticleResp.status()).toEqual(200);
  expect(getArticleRespJson.articles.length).toEqual(10);
});

test("Create and Delete Article", async ({ request }) => {
  const postArticleResp = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      headers: {
        Authorization: authToken,
      },
      data: {
        article: {
          title: "test1",
          description: "test desc",
          body: "test body",
          tagList: ["playwright"],
        },
      },
    },
  );
  const postArticleRespjson = await postArticleResp.json();
  const slugID = postArticleRespjson.article.slug;
  const getArticleResp = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles",
    {
      params: {
        limit: 10,
        offset: 0,
      },
      headers: {
        Authorization: authToken,
      },
    },
  );
  const getArticleRespJson = await getArticleResp.json();
  expect(getArticleRespJson.articles[0].title).toEqual("test1");

  const deleteResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slugID}`,
    {
      headers: {
        Authorization: authToken,
      },
    },
  );
  expect(deleteResponse.status()).toEqual(204);
});

test("Create update and Delete Article", async ({ request }) => {
  const postArticleResp = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      headers: {
        Authorization: authToken,
      },
      data: {
        article: {
          title: "Test New Article",
          description: "test desc",
          body: "test body",
          tagList: ["playwright"],
        },
      },
    },
  );
  const postArticleRespjson = await postArticleResp.json();
  const slugID = postArticleRespjson.article.slug;
  const getArticleResp = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles",
    {
      params: {
        limit: 10,
        offset: 0,
      },
      headers: {
        Authorization: authToken,
      },
    },
  );
  const getArticleRespJson = await getArticleResp.json();
  expect(getArticleRespJson.articles[0].title).toEqual("Test New Article");
  ///////////////////////
  const updateArticleResp = await request.put(
    `https://conduit-api.bondaracademy.com/api/articles/${slugID}`,
    {
      headers: {
        Authorization: authToken,
      },
      data: {
        article: {
          title: "Updated Article Title",
          description: "Updated description",
          body: "Updated body",
          tagList: ["playwright", "updated"],
        },
      },
    },
  );
  const updateArticleRespJson = await updateArticleResp.json();
  expect(updateArticleResp.status()).toEqual(200);
  expect(updateArticleRespJson.article.title).toEqual("Updated Article Title");
  expect(updateArticleRespJson.article.description).toEqual(
    "Updated description",
  );
  expect(updateArticleRespJson.article.body).toEqual("Updated body");
  const newslugID = updateArticleRespJson.article.slug;
  //////////////////
  const deleteResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${newslugID}`,
    {
      headers: {
        Authorization: authToken,
      },
    },
  );
  expect(deleteResponse.status()).toEqual(204);
});
