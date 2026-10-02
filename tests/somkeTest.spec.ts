import { test } from "../Utils/fixtures";

test("first test", async ({api}) => {
  api
    // .url("https://random.com/api")
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .headers({ Authorization: "authToken" })
    .body({
      article: {
        title: "test1",
        description: "test desc",
        body: "test body",
        tagList: ["playwright"],
      },
    });
    api.getUrl();
    
});
