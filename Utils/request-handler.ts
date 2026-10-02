export class RequestHandler {
  private baseUrl!: string;
  private defaultBaseUrl: string = "https://conduit-api.bondaracademy.com/api";
  private apiPath: String = "";
  private queryParams: object = {};
  private requestHeaders: object = {};
  private requestBody: object = {};

  url(url: string) {
    this.baseUrl = url;
    return this;
  }
  path(path: string) {
    this.apiPath = path;
    return this;
  }
  params(params: object) {
    this.queryParams = params;
    return this;
  }
  headers(headers: object) {
    this.requestHeaders = headers;
    return this;
  }
  body(body: object) {
    this.requestBody = body;
    return this;
  }

  private getUrl() {
    const url = new URL(
      `${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`,
    );
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, String(value));
    }
    console.log("URL:", url.toString());
    return url.toString();
  }
}
