import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  ChangeMessageVisibilityCommand,
  GetQueueAttributesCommand,
} from "@aws-sdk/client-sqs";
import { config } from "../config";
import { createLogger } from "../utils/logger";
import { SQSJobMessage } from "../types";

const logger = createLogger("SQSService");

export interface SQSMessage {
  messageId: string;
  receiptHandle: string;
  body: SQSJobMessage;
}

class SQSService {
  private client: SQSClient;
  private queueUrl: string;

  constructor() {
    const clientConfig: any = {
      region: config.aws.region,
    };

    this.client = new SQSClient(clientConfig);
    this.queueUrl = config.aws.sqs.queueUrl;

    logger.info("SQS client initialized", { queueUrl: this.queueUrl });
  }

  // Receive messages from the queue

  async receiveMessages(maxMessages: number = 1): Promise<SQSMessage[]> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: Math.min(maxMessages, 10),
        MessageAttributeNames: ["All"],
      });

      const response = await this.client.send(command);

      if (!response.Messages || response.Messages.length === 0) {
        return [];
      }

      const messages: SQSMessage[] = [];

      for (const message of response.Messages) {
        try {
          if (!message.Body || !message.ReceiptHandle || !message.MessageId) {
            logger.warn("Invalid SQS message received", {
              messageId: message.MessageId,
            });
            continue;
          }

          const body = JSON.parse(message.Body) as SQSJobMessage;

          messages.push({
            messageId: message.MessageId,
            receiptHandle: message.ReceiptHandle,
            body,
          });

          logger.debug("Received SQS message", {
            messageId: message.MessageId,
            jobId: body.jobId,
          });
        } catch (error: any) {
          logger.error("Failed to parse SQS message", {
            messageId: message.MessageId,
            error: error.message,
          });
        }
      }

      logger.info("Received messages from SQS", { count: messages.length });
      return messages;
    } catch (error: any) {
      logger.error("Failed to receive messages from SQS", {
        error: error.message,
        code: error.code,
      });
      throw error;
    }
  }

  // Delete a message from the queue (acknowledge processing)

  async deleteMessage(receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.client.send(command);
      logger.debug("Deleted message from SQS", {
        receiptHandle: receiptHandle.substring(0, 20),
      });
    } catch (error: any) {
      logger.error("Failed to delete message from SQS", {
        error: error.message,
        receiptHandle: receiptHandle.substring(0, 20),
      });
      throw error;
    }
  }

  // Change message visibility timeout (extend processing time)

  async changeMessageVisibility(
    receiptHandle: string,
    visibilityTimeout: number,
  ): Promise<void> {
    try {
      const command = new ChangeMessageVisibilityCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
        VisibilityTimeout: visibilityTimeout,
      });

      await this.client.send(command);
      logger.debug("Changed message visibility", {
        receiptHandle: receiptHandle.substring(0, 20),
        visibilityTimeout,
      });
    } catch (error: any) {
      logger.error("Failed to change message visibility", {
        error: error.message,
      });
    }
  }

  // Get queue statistics

  async getQueueStats(): Promise<{
    approximateNumberOfMessages: number;
    approximateNumberOfMessagesNotVisible: number;
  }> {
    try {
      const command = new GetQueueAttributesCommand({
        QueueUrl: this.queueUrl,
        AttributeNames: [
          "ApproximateNumberOfMessages",
          "ApproximateNumberOfMessagesNotVisible",
        ],
      });

      const response = await this.client.send(command);
      const attributes = response.Attributes || {};

      return {
        approximateNumberOfMessages: parseInt(
          attributes.ApproximateNumberOfMessages || "0",
          10,
        ),
        approximateNumberOfMessagesNotVisible: parseInt(
          attributes.ApproximateNumberOfMessagesNotVisible || "0",
          10,
        ),
      };
    } catch (error: any) {
      logger.error("Failed to get queue stats", { error: error.message });
      return {
        approximateNumberOfMessages: 0,
        approximateNumberOfMessagesNotVisible: 0,
      };
    }
  }

  // Health check

  async healthCheck(): Promise<boolean> {
    try {
      await this.getQueueStats();
      return true;
    } catch {
      return false;
    }
  }
}

export const sqsService = new SQSService();
