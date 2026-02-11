export class VideoProcessorError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class VideoDownloadError extends VideoProcessorError {
  constructor(message: string, retryable: boolean = true) {
    super(message, "VIDEO_DOWNLOAD_ERROR", 500, retryable);
  }
}

export class VideoProcessingError extends VideoProcessorError {
  constructor(message: string, retryable: boolean = false) {
    super(message, "VIDEO_PROCESSING_ERROR", 500, retryable);
  }
}

export class VideoValidationError extends VideoProcessorError {
  constructor(message: string) {
    super(message, "VIDEO_VALIDATION_ERROR", 400, false);
  }
}

export class S3UploadError extends VideoProcessorError {
  constructor(message: string, retryable: boolean = true) {
    super(message, "S3_UPLOAD_ERROR", 500, retryable);
  }
}

export class DatabaseError extends VideoProcessorError {
  constructor(message: string, retryable: boolean = true) {
    super(message, "DATABASE_ERROR", 500, retryable);
  }
}

export class ConfigurationError extends VideoProcessorError {
  constructor(message: string) {
    super(message, "CONFIGURATION_ERROR", 500, false);
  }
}

export function isRetryableError(error: Error): boolean {
  if (error instanceof VideoProcessorError) {
    return error.retryable;
  }
  if (
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("ETIMEDOUT") ||
    error.message.includes("ENOTFOUND")
  ) {
    return true;
  }
  return false;
}
