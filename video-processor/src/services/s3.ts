import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { createReadStream } from "fs";
import { config } from "../config";
import { createLogger } from "../utils/logger";
import { S3UploadError } from "../config/errors";
import { FileSystemUtils } from "../utils/filesystem";
import path from "path";

const logger = createLogger("S3Service");

class S3Service {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      region: config.aws.region,
    });
    this.bucket = config.aws.s3.bucket;

    logger.info("S3 client initialized", {
      bucket: this.bucket,
      region: config.aws.region,
    });
  }

  // Upload a file to S3 using multipart upload for large files

  async uploadFile(
    filePath: string,
    s3Key: string,
    contentType: string = "video/mp4",
  ): Promise<{ s3Key: string; fileSize: number }> {
    try {
      const fileSize = await FileSystemUtils.getFileSize(filePath);
      const fileStream = createReadStream(filePath);

      logger.info("Starting S3 upload", {
        filePath: path.basename(filePath),
        s3Key,
        fileSize,
      });

      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: this.bucket,
          Key: s3Key,
          Body: fileStream,
          ContentType: contentType,
          // Enable server-side encryption
          ServerSideEncryption: "AES256",
          // Set metadata
          Metadata: {
            "uploaded-at": new Date().toISOString(),
            "original-filename": path.basename(filePath),
          },
        },
        // Multipart upload configuration
        queueSize: 4, // Concurrent parts
        partSize: 5 * 1024 * 1024, // 5MB parts
        leavePartsOnError: false,
      });

      // Track progress
      upload.on("httpUploadProgress", (progress) => {
        if (progress.loaded && progress.total) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          logger.debug("Upload progress", {
            s3Key,
            percent,
            loaded: progress.loaded,
            total: progress.total,
          });
        }
      });

      await upload.done();

      logger.info("S3 upload completed", { s3Key, fileSize });
      return { s3Key, fileSize };
    } catch (error: any) {
      logger.error("S3 upload failed", {
        s3Key,
        error: error.message,
        code: error.code,
      });
      throw new S3UploadError(`Failed to upload file to S3: ${error.message}`);
    }
  }

  // Delete a file from S3

  async deleteFile(s3Key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
      });

      await this.client.send(command);
      logger.info("Deleted file from S3", { s3Key });
    } catch (error: any) {
      logger.error("Failed to delete file from S3", {
        s3Key,
        error: error.message,
      });
    }
  }

  // Check if a file exists in S3

  async fileExists(s3Key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
      });

      await this.client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === "NotFound") {
        return false;
      }
      throw error;
    }
  }

  // Generate S3 key for a video clip

  generateS3Key(jobId: string, format: string = "mp4"): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Structure: clips/YYYY/MM/DD/jobId.mp4
    return `clips/${year}/${month}/${day}/${jobId}.${format}`;
  }

  // Get public URL for a file (if bucket is public or using CloudFront)

  getPublicUrl(s3Key: string): string {
    // In production, you'd use CloudFront URL
    // For now, return S3 URL (bucket must be public or have presigned URLs)
    return `https://${this.bucket}.s3.${config.aws.region}.amazonaws.com/${s3Key}`;
  }

  // Batch delete files

  async deleteFiles(s3Keys: string[]): Promise<void> {
    const deletePromises = s3Keys.map((key) => this.deleteFile(key));
    await Promise.allSettled(deletePromises);
    logger.info("Batch deleted files from S3", { count: s3Keys.length });
  }

  // Health check

  async healthCheck(): Promise<boolean> {
    try {
      // Try to list objects (limited to 1) to verify connection
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: "health-check-dummy", // This won't exist, but the request validates credentials
      });

      await this.client.send(command);
      return true;
    } catch (error: any) {
      // NotFound is expected and means S3 connection works
      if (error.name === "NotFound" || error.code === "NotFound") {
        return true;
      }
      logger.error("S3 health check failed", { error: error.message });
      return false;
    }
  }
}

export const s3Service = new S3Service();
