const processENV = process.env.TEST_ENV;
const env = processENV || "prod";

console.log("Current Environment:", env);

const config = {
  apiUrl: "https://conduit-api.bondaracademy.com/api",
  email: "nafees.mca07@gmail.com",
  password: "khan1234",
};

if (env === "qa") {
  config.apiUrl = "https://conduit-api.bondaracademy.com/api";
  config.email = "nafees@gmail.com";
  config.password = "nafees1234";
}
if (env === "prod") {
  config.apiUrl = "https://conduit-api.bondaracademy.com/api";
  config.email = "nafees.mca07@gmail.com";
  config.password = "khan1234";
}

export { config };
