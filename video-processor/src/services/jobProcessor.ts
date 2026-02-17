import path from "path";
import { database } from "./database";
import { s3Service } from "./s3";
import { videoDownloader } from "./videoDownloader";
import { sqsService, SQSMessage } from "./sqs";
import { config } from "../config";
import { createLogger, logWithJob } from "../utils/logger";
import { FileSystemUtils } from "../utils/filesystem";
import { ClipStatus, ProcessingResult } from "../types";
import { isRetryableError } from "../config/errors";

const logger = createLogger("JobProcessor");

export class JobProcessor {
  private isProcessing: boolean = false;
  private activeJobs: Set<string> = new Set();

  // Process a single job

  async processJob(message: SQSMessage): Promise<ProcessingResult> {
    const { jobId, youtubeUrl, startTime, endTime, shareToken } = message.body;
    const jobTempDir = await FileSystemUtils.createJobTempDir(
      config.video.tempDir,
      jobId,
    );
    const outputFileName = `${shareToken}.${config.video.outputFormat}`;
    const outputPath = path.join(jobTempDir, outputFileName);

    logWithJob(jobId, "info", "Starting job processing", {
      youtubeUrl,
      startTime,
      endTime,
    });

    try {
      // Update status to processing
      await database.updateClipStatus(jobId, ClipStatus.PROCESSING);

      // Download and trim video
      logWithJob(jobId, "info", "Downloading video clip");
      const downloadResult = await videoDownloader.downloadClip({
        youtubeUrl,
        startTime,
        endTime,
        outputPath,
        jobId,
      });

      logWithJob(jobId, "info", "Video downloaded successfully", {
        fileSize: downloadResult.fileSize,
        duration: downloadResult.duration,
      });

      // Upload to S3
      const s3Key = s3Service.generateS3Key(jobId, config.video.outputFormat);
      logWithJob(jobId, "info", "Uploading to S3", { s3Key });

      const { fileSize } = await s3Service.uploadFile(
        outputPath,
        s3Key,
        `video/${config.video.outputFormat}`,
      );

      logWithJob(jobId, "info", "Upload to S3 completed", { s3Key, fileSize });

      // Step 3: Update database with success
      await database.updateClipCompleted(
        jobId,
        s3Key,
        fileSize,
        downloadResult.duration,
      );

      logWithJob(jobId, "info", "Job completed successfully", { s3Key });

      // Cleanup temporary files
      await FileSystemUtils.deleteDir(jobTempDir);

      return {
        success: true,
        s3Key,
        fileSize,
        duration: downloadResult.duration,
      };
    } catch (error: any) {
      logWithJob(jobId, "error", "Job processing failed", {
        error: error.message,
        code: error.code,
        retryable: isRetryableError(error),
      });

      // Update database with failure
      await database.updateClipStatus(jobId, ClipStatus.FAILED, error.message);

      // Cleanup temporary files
      await FileSystemUtils.deleteDir(jobTempDir);

      return {
        success: false,
        errorMessage: error.message,
      };
    }
  }

  // Process a message from SQS

  async processMessage(message: SQSMessage): Promise<void> {
    const { jobId } = message.body;

    // Prevent duplicate processing
    if (this.activeJobs.has(jobId)) {
      logger.warn("Job already being processed", { jobId });
      return;
    }

    this.activeJobs.add(jobId);

    try {
      // Verify job exists in database
      const clip = await database.getClipById(jobId);
      if (!clip) {
        logger.error("Job not found in database", { jobId });
        await sqsService.deleteMessage(message.receiptHandle);
        return;
      }

      // Process the job
      const result = await this.processJob(message);

      // Delete message from queue on success
      if (result.success) {
        await sqsService.deleteMessage(message.receiptHandle);
        logger.info("Message deleted from queue", { jobId });
      } else {
        // On failure, let the message return to queue for retry
        // (SQS will handle retry based on visibility timeout)
        logger.warn("Message will be retried", { jobId });
      }
    } catch (error: any) {
      logger.error("Unexpected error processing message", {
        jobId,
        error: error.message,
      });
    } finally {
      this.activeJobs.delete(jobId);
    }
  }

  // Poll SQS for new messages
  async pollMessages(): Promise<void> {
    if (this.isProcessing) {
      logger.debug("Already processing, skipping poll");
      return;
    }

    this.isProcessing = true;

    try {
      // Calculate how many messages we can handle
      const availableSlots = config.worker.concurrency - this.activeJobs.size;

      if (availableSlots <= 0) {
        logger.debug("No available processing slots", {
          concurrency: config.worker.concurrency,
          activeJobs: this.activeJobs.size,
        });
        return;
      }

      // Receive messages
      const messages = await sqsService.receiveMessages(
        Math.min(availableSlots, config.aws.sqs.maxMessages),
      );

      if (messages.length === 0) {
        logger.debug("No messages in queue");
        return;
      }

      logger.info("Processing messages", { count: messages.length });

      // Process messages concurrently
      const processingPromises = messages.map((message) =>
        this.processMessage(message).catch((error) => {
          logger.error("Error in processMessage", {
            messageId: message.messageId,
            error: error.message,
          });
        }),
      );

      await Promise.all(processingPromises);
    } catch (error: any) {
      logger.error("Error polling messages", { error: error.message });
    } finally {
      this.isProcessing = false;
    }
  }

  // Start the worker loop

  async start(): Promise<void> {
    logger.info("Starting job processor", {
      concurrency: config.worker.concurrency,
      pollInterval: config.worker.pollIntervalMs,
    });

    // Continuous polling loop
    const poll = async () => {
      try {
        await this.pollMessages();
      } catch (error: any) {
        logger.error("Error in poll loop", { error: error.message });
      }

      // Schedule next poll
      setTimeout(poll, config.worker.pollIntervalMs);
    };

    // Start polling
    poll();
  }

  // Get current worker stats

  getStats(): {
    activeJobs: number;
    concurrency: number;
    availableSlots: number;
  } {
    return {
      activeJobs: this.activeJobs.size,
      concurrency: config.worker.concurrency,
      availableSlots: config.worker.concurrency - this.activeJobs.size,
    };
  }

  // Graceful shutdown

  async shutdown(): Promise<void> {
    logger.info("Shutting down job processor");

    // Wait for active jobs to complete (with timeout)
    const timeout = 60000; // 60 seconds
    const start = Date.now();

    while (this.activeJobs.size > 0 && Date.now() - start < timeout) {
      logger.info("Waiting for active jobs to complete", {
        activeJobs: this.activeJobs.size,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (this.activeJobs.size > 0) {
      logger.warn("Forced shutdown with active jobs", {
        activeJobs: this.activeJobs.size,
      });
    }

    logger.info("Job processor shut down");
  }
}

export const jobProcessor = new JobProcessor();
