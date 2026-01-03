export class LoggerService {
  private static format(level: string, message: string, meta?: any) {
    return JSON.stringify({
      severity: level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  static info(message: string, meta?: any) {
    console.log(this.format('INFO', message, meta));
  }

  static error(message: string, error?: any) {
    console.error(
      this.format('ERROR', message, {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      }),
    );
  }

  static warn(message: string, meta?: any) {
    console.warn(this.format('WARNING', message, meta));
  }
}
