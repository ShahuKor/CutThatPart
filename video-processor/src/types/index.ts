export enum ClipStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface ClipJob {
  id: string;
  youtubeUrl: string;
  startTime: number;
  endTime: number;
  sharerName?: string;
  shareToken: string;
  status: ClipStatus;
  s3Key?: string;
  errorMessage?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface ProcessingResult {
  success: boolean;
  s3Key?: string;
  fileSize?: number;
  duration?: number;
  errorMessage?: string;
}

export interface SQSJobMessage {
  jobId: string;
  youtubeUrl: string;
  startTime: number;
  endTime: number;
  shareToken: string;
}

export interface VideoMetadata {
  title: string;
  duration: number;
  format: string;
  resolution: string;
}
