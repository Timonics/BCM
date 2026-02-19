import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Request Logging Middleware
 * Logs all incoming HTTP requests with method, URL, status code, and response time
 * Useful for debugging and monitoring API usage
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    // Log request
    this.logger.log(`${method} ${originalUrl} - ${ip}`);

    // Override res.end to capture status code and response time
    const originalEnd = res.end.bind(res);
    res.end = function (
      chunk?: any,
      encoding?: BufferEncoding | (() => void),
      cb?: () => void,
    ) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Color code based on status
      let statusColor = '\x1b[0m'; // Reset
      if (statusCode >= 500) {
        statusColor = '\x1b[31m'; // Red
      } else if (statusCode >= 400) {
        statusColor = '\x1b[33m'; // Yellow
      } else if (statusCode >= 300) {
        statusColor = '\x1b[36m'; // Cyan
      } else if (statusCode >= 200) {
        statusColor = '\x1b[32m'; // Green
      }

      // Log response
      const logger = new Logger('HTTP');
      logger.log(
        `${statusColor}${method} ${originalUrl} ${statusCode}${'\x1b[0m'} - ${duration}ms`,
      );

      // Call original end with proper arguments
      if (typeof encoding === 'function') {
        return originalEnd(chunk, encoding);
      }
      if (cb) {
        return originalEnd(chunk, encoding as BufferEncoding, cb);
      }
      return originalEnd(chunk, encoding as BufferEncoding);
    };

    next();
  }
}

