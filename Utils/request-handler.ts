import { APIRequestContext } from "@playwright/test";
import { test, expect, request } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {
  private request: APIRequestContext;
  private logger: APILogger;
  private baseUrl!: string | undefined;
  private defaultBaseUrl!: string;
  private apiPath: String = "";
  private queryParams: object = {};
  private requestHeaders: Record<string, string> = {};
  private requestBody: object = {};
  private defaultAuthToken: string;
  private clearAuthFlag: boolean = false;

  constructor(
    request: APIRequestContext,
    apiBaseUrl: string,
    logger: APILogger,
    authToken: string = "",
  ) {
    this.request = request;
    this.baseUrl = apiBaseUrl;
    this.logger = logger;
    this.defaultBaseUrl = apiBaseUrl;
    this.defaultAuthToken = authToken;
  }

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
  headers(headers: Record<string, string>) {
    this.requestHeaders = headers;
    return this;
  }
  body(body: object) {
    this.requestBody = body;
    return this;
  }

  clearAuth() {
    this.clearAuthFlag = true;
    return this;
  }

  async getRequest(status: number) {
    const url = this.getUrl();
    this.logger.logRequest("GET", url, this.getHeaders());
    const reponse = await this.request.get(url, {
      headers: this.getHeaders(),
    });
    this.cleanUpFields();
    const actualStatus = reponse.status();
    const responseJson = await reponse.json();
    this.logger.logResponse(actualStatus, responseJson);
    this.statusCodeValidator(actualStatus, status, this.getRequest);
    return responseJson;
  }

  async postRequest(status: number) {
    const url = this.getUrl();
    this.logger.logRequest("POST", url, this.getHeaders(), this.requestBody);
    const reponse = await this.request.post(url, {
      headers: this.getHeaders(),
      data: this.requestBody,
    });
    this.cleanUpFields();
    const actualStatus = reponse.status();
    const responseJson = await reponse.json();
    this.logger.logResponse(actualStatus, responseJson);
    this.statusCodeValidator(actualStatus, status, this.postRequest);
    return responseJson;
  }

  async putRequest(status: number) {
    const url = this.getUrl();
    this.logger.logRequest("PUT", url, this.getHeaders(), this.requestBody);
    const reponse = await this.request.put(url, {
      headers: this.getHeaders(),
      data: this.requestBody,
    });
    this.cleanUpFields();
    const actualStatus = reponse.status();
    const responseJson = await reponse.json();
    this.logger.logResponse(actualStatus, responseJson);
    this.statusCodeValidator(actualStatus, status, this.putRequest);
    return responseJson;
  }

  async deleteRequest(status: number) {
    const url = this.getUrl();
    this.logger.logRequest("DELETE", url, this.getHeaders());
    const reponse = await this.request.delete(url, {
      headers: this.getHeaders(),
    });
    this.cleanUpFields();
    const actualStatus = reponse.status();
    this.logger.logResponse(actualStatus);
    this.statusCodeValidator(actualStatus, status, this.deleteRequest);
  }

  private getUrl() {
    const url = new URL(
      `${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`,
    );
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, String(value));
    }
    // console.log("URL:", url.toString());
    return url.toString();
  }

  private statusCodeValidator(
    actualStatus: number,
    expectedStatus: number,
    callingMethod: Function,
  ) {
    if (actualStatus !== expectedStatus) {
      const logs = this.logger.getRecentLogs();
      const error = new Error(
        `Expected status code ${expectedStatus}, but got ${actualStatus}\n\nRecent Logs:\n${logs}`,
      );
      (
        Error as ErrorConstructor & {
          captureStackTrace?: (target: object, constructor?: Function) => void;
        }
      ).captureStackTrace?.(error, callingMethod);
      throw error;
    }
  }

  private getHeaders() {
    if (!this.clearAuthFlag) {
      this.requestHeaders["Authorization"] =
        this.requestHeaders["Authorization"] || this.defaultAuthToken;
    }
    return this.requestHeaders;
  }

  private cleanUpFields() {
    this.requestHeaders = {};
    this.requestBody = {};
    this.queryParams = {};
    this.apiPath = "";
    this.baseUrl = undefined;
    this.clearAuthFlag = false;
  }
}
