"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProcessingStatus from "@/components/ui/ProcessingStatus";
import VideoPlayer from "@/components/ui/VideoPlayer";
import Link from "next/link";

export default function ClipPage() {
  const params = useParams();
  const token = params.token as string;

  const [clip, setClip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchClip() {
      try {
        const response = await fetch(`/api/clips/${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load clip");
        }

        setClip(data.clip);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClip();
  }, [token]);

  const handleComplete = (s3Url: string) => {
    setClip((prev: any) => ({ ...prev, status: "completed", s3_key: s3Url }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!clip) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Clip Not Found</h1>
        <p className="text-gray-600">This clip doesn't exist or has expired.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {clip.status === "completed" ? (
        <>
          <h1 className="text-3xl font-bold mb-8 text-center">
            Your Clip is Ready!
          </h1>
          <VideoPlayer
            s3Url={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${clip.s3_key}`}
            sharerName={clip.sharer_name}
            shareToken={token}
          />
        </>
      ) : clip.status === "failed" ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Processing Failed
          </h1>
          <p className="text-gray-600 mb-4">
            {clip.error_message || "Something went wrong"}
          </p>
          <Link href="/create" className="text-blue-600 hover:underline">
            Try creating a new clip
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8 text-center">
            Processing Your Clip
          </h1>
          <ProcessingStatus token={token} onComplete={handleComplete} />
        </>
      )}
    </div>
  );
}
