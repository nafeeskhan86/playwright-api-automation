export class APILogger {
  private recentLogs: any[] = [];

  logRequest = (
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: any,
  ) => {
    const logEntry = {
      type: "request",
      method,
      url,
      headers,
      body,
      timestamp: new Date().toISOString(),
    };
    this.recentLogs.push(logEntry);
  };

  logResponse = (statusCode: number, body?: any) => {
    const logEntry = {
      type: "response",
      statusCode,
      body,
      timestamp: new Date().toISOString(),
    };
    this.recentLogs.push(logEntry);
  };
  getRecentLogs() {
    const logs = this.recentLogs
      .map((log) => {
        return `==========${log.type}===========\n${JSON.stringify(log, null, 2)}\n====================`;
      })
      .join("\n\n");
    return logs;
  }
}
