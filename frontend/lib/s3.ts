import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generatePresignedUrl(s3Key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!,
    Key: s3Key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 7200 });

  return url;
}
