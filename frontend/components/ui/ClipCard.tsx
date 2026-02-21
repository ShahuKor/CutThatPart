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
        return "text-green-600 dark:text-green-500/50";
      case "processing":
        return "text-blue-600 dark:text-blue-500/50";
      case "pending":
        return "text-yellow-600 dark:text-yellow-500/50";
      case "failed":
        return "text-red-600 dark:text-red-500/50";
      default:
        return "text-gray-600 dark:text-gray-500/50";
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
    <div className="group relative border border-neutral-900/30 dark:border-neutral-300/30 rounded-lg p-4 hover:shadow-lg hover:shadow-neutral-900/10 dark:hover:shadow-black/30 hover:border-neutral-400/60 dark:hover:border-neutral-500/50 transition-all duration-300 isolate overflow-hidden">
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(212,212,212,0.09)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(163,163,163,0.06)_0%,transparent_55%)]" />

      <div className="relative aspect-video bg-gray-200 rounded-md mb-3 overflow-hidden">
        <img
          src={`https://img.youtube.com/vi/${extractVideoId(clip.youtube_url)}/mqdefault.jpg`}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.14)_50%,transparent_60%)] bg-[length:200%_100%] bg-[position:200%_0] group-hover:bg-[position:-50%_0] transition-[background-position] duration-500 pointer-events-none" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <span
          className={` rounded-sm text-xs md:text-sm font-normal ${getStatusColor(clip.status)}`}
        >
          {getStatusText(clip.status)}
        </span>
        {clip.duration && (
          <span className="text-xs font-light md:text-sm text-neutral-800 dark:text-neutral-300/60">
            {clip.duration}s
          </span>
        )}
      </div>

      <p className="text-xs font-light md:text-sm text-neutral-800 dark:text-neutral-300/60 mb-4">
        Created{" "}
        {formatDistanceToNow(new Date(clip.created_at), { addSuffix: true })}
      </p>

      {clip.error_message && (
        <p className="text-sm text-red-600 mb-2">{clip.error_message}</p>
      )}

      {clip.status === "completed" ? (
        <Link
          href={`/clip/${clip.share_token}`}
          className="block w-full py-2 text-center border-stone-800 text-[12px] dark:border-stone-200 border hover:bg-white dark:hover:bg-neutral-950 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors ease-in-out duration-300 hover:border-neutral-500/50 dark:hover:border-neutral-400/50 hover:border rounded-none sm:text-xs md:text-sm bg-stone-800 dark:bg-stone-100 text-white dark:text-neutral-900"
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
