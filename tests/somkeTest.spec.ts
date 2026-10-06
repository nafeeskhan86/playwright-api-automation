import { test } from "../Utils/fixtures";
import { expect } from "@playwright/test";

let authToken: string;

test.beforeAll("Run this before all tests", async ({ api, config }) => {
  const authResponse = await api
    .path("/users/login")
    .body({
      user: {
        email: config.email,
        password: config.password,
      },
    })
    .postRequest(200);
  authToken = "Token " + authResponse.user.token;
  // console.log(authResponse.user);
});

test("Get Article", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(response.articles.length).toBeLessThanOrEqual(10);
  expect(response.articlesCount).shouldEqual(10);

  const response2 = await api.path("/tags").getRequest(200);
  expect(response2.tags[0]).toEqual("Test");
  expect(response2.tags.length).shouldBeLessThanOrEqual(4);
  expect(response2).toHaveProperty("tags");
});

test("Get Tags", async ({ api }) => {
  const response = await api.path("/tags").getRequest(200);
  expect(response.tags[0]).toEqual("Test");
  expect(response.tags.length).toBeLessThanOrEqual(10);
  expect(response).toHaveProperty("tags");
});

test("Create and Delete Article", async ({ api }) => {
  const postArticleResp = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "My Article",
        description: "This is a test article",
        body: "This is the content of the test article",
      },
    })
    .postRequest(201);
  const slugID = postArticleResp.article.slug;
  const getArticleResp = await api
    .path(`/articles`)
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(getArticleResp.articles[0].title).toEqual("My Article");

  const deleteArticleResp = await api
    .path(`/articles/${slugID}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204);
});

test("Create Update and Delete Article", async ({ api }) => {
  const postArticleResp = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "My Article",
        description: "This is a test article",
        body: "This is the content of the test article",
      },
    })
    .postRequest(201);
  const slugID = postArticleResp.article.slug;
  const getArticleResp = await api
    .path(`/articles`)
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(getArticleResp.articles[0].title).toEqual("My Article");

  const updateArticleResp = await api
    .path(`/articles/${slugID}`)
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: "Updated Article",
        description: "This is an updated test article",
        body: "This is the updated content of the test article",
      },
    })
    .putRequest(200);
  expect(updateArticleResp.article.title).toEqual("Updated Article");
  const newslugID = updateArticleResp.article.slug;

  const deleteArticleResp = await api
    .path(`/articles/${newslugID}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204);

  const getArticleRespTwo = await api
    .path(`/articles`)
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(getArticleRespTwo.articles[0].title).not.toEqual("Updated Article");
});
