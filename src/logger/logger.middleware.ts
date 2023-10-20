import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode, statusMessage } = response;

      if (statusCode >= 200 && statusCode < 400) {
        this.logger.log(
          `${method} ${originalUrl} Response Body: { ${statusCode} ${statusMessage} } - ${userAgent} ${ip}`,
        );
      } else {
        this.logger.error(
          `${method} ${originalUrl} Response Body: { ${statusCode} ${statusMessage} } - ${userAgent} ${ip}`,
        );
      }
    });

    response.on('error', () => {
      this.logger.error(
        `${method} ${originalUrl} Response Error: - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
