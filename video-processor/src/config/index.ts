import { config as dotenvConfig } from "dotenv";
import { Config } from "../types";
dotenvConfig();

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvVarAsNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ? parseInt(value, 10) : defaultValue!;
}

export const config: Config = {
  env: getEnvVar("NODE_ENV", "development"),

  logging: {
    level: getEnvVar("LOG_LEVEL", "info"),
  },

  aws: {
    region: getEnvVar("AWS_REGION", "us-east-1"),
    s3: {
      bucket: getEnvVar("S3_BUCKET"),
    },
    sqs: {
      queueUrl: getEnvVar("SQS_QUEUE_URL"),
    },
  },

  database: {
    connectionString: getEnvVar("DATABASE_URL"),
  },

  video: {
    maxDuration: getEnvVarAsNumber("VIDEO_MAX_DURATION", 600),
    tempDir: getEnvVar("VIDEO_TEMP_DIR", "/tmp/video-clips"),
  },
};
