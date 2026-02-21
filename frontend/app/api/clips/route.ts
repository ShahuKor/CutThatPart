import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { youtubeUrl, startTime, endTime, sharerName } = body;

    // Validation
    if (
      !youtubeUrl ||
      (!youtubeUrl.includes("youtube.com") && !youtubeUrl.includes("youtu.be"))
    ) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 },
      );
    }

    if (startTime < 0 || endTime <= startTime) {
      return NextResponse.json(
        { error: "Invalid time range" },
        { status: 400 },
      );
    }

    if (endTime - startTime > 600) {
      return NextResponse.json(
        { error: "Clip duration cannot exceed 10 minutes" },
        { status: 400 },
      );
    }

    const shareToken = nanoid(10);
    const clipId = crypto.randomUUID();

    // Insert into db
    await sql`
      INSERT INTO clips (id, user_id, youtube_url, start_time, end_time, share_token, sharer_name, status)
      VALUES (${clipId}, ${userId}, ${youtubeUrl}, ${startTime}, ${endTime}, ${shareToken}, ${sharerName || "Anonymous"}, 'pending')
    `;

    // Send to SQS
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL!,
        MessageBody: JSON.stringify({
          jobId: clipId,
          youtubeUrl,
          startTime,
          endTime,
          shareToken,
        }),
      }),
    );

    return NextResponse.json({
      success: true,
      token: shareToken,
      clipId,
    });
  } catch (error: any) {
    console.error("Create clip error:", error);
    return NextResponse.json(
      { error: "Failed to create clip" },
      { status: 500 },
    );
  }
}
