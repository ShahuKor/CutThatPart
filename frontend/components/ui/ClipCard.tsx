"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ClipCardProps {
  clip: {
    id: string;
    youtube_url: string;
    share_token: string;
    status: string;
    created_at: string;
    expires_at: string;
    duration?: number;
    error_message?: string;
  };
}

export default function ClipCard({ clip }: ClipCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Ready";
      case "processing":
        return "Processing...";
      case "pending":
        return "In Queue";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 rounded-md mb-3 overflow-hidden">
        <img
          src={`https://img.youtube.com/vi/${extractVideoId(clip.youtube_url)}/mqdefault.jpg`}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(clip.status)}`}
        >
          {getStatusText(clip.status)}
        </span>
        {clip.duration && (
          <span className="text-sm text-gray-500">{clip.duration}s</span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-2">
        Created{" "}
        {formatDistanceToNow(new Date(clip.created_at), { addSuffix: true })}
      </p>

      {clip.error_message && (
        <p className="text-sm text-red-600 mb-2">{clip.error_message}</p>
      )}

      {clip.status === "completed" ? (
        <Link
          href={`/clip/${clip.share_token}`}
          className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          View & Share
        </Link>
      ) : clip.status === "processing" || clip.status === "pending" ? (
        <Link
          href={`/clip/${clip.share_token}`}
          className="block w-full text-center bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition"
        >
          View Status
        </Link>
      ) : (
        <button
          className="w-full bg-gray-300 text-gray-500 py-2 rounded-md cursor-not-allowed"
          disabled
        >
          Failed
        </button>
      )}
    </div>
  );
}

function extractVideoId(url: string): string {
  const regex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : "";
}
