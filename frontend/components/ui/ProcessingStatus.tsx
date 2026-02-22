"use client";

import { useEffect, useState } from "react";

interface ProcessingStatusProps {
  token: string;
  onComplete: (s3Url: string) => void;
}

export default function ProcessingStatus({
  token,
  onComplete,
}: ProcessingStatusProps) {
  const [status, setStatus] = useState<string>("pending");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/clips/${token}`);
        const data = await response.json();

        if (data.clip) {
          setStatus(data.clip.status);

          if (data.clip.status === "completed" && data.clip.s3_key) {
            onComplete(data.clip.s3_key);
          }
        }
      } catch (error) {
        console.error("Failed to check status:", error);
      }
    };

    const interval = setInterval(checkStatus, 3000);
    checkStatus();

    return () => clearInterval(interval);
  }, [token, onComplete]);

  useEffect(() => {
    if (status === "processing") {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.random() * 10;
        });
      }, 1000);

      return () => clearInterval(progressInterval);
    } else if (status === "completed") {
      setProgress(100);
    }
  }, [status]);

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        {status === "pending" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-600 dark:border-neutral-200 mx-auto mb-4"></div>
            <h2 className="text-neutral-500 dark:text-neutral-400 tracking-wide font-normal text-xs sm:text-sm md:text-md lg:text-lg mb-2">
              In Queue
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 tracking-wide font-normal text-xs sm:text-sm md:text-md lg:text-lg">
              Your clip is waiting to be processed...
            </p>
          </>
        )}

        {status === "processing" && (
          <>
            <div className="animate-pulse rounded-full h-16 w-16 bg-stone-700 dark:bg-stone-200 mx-auto mb-4"></div>
            <h2 className="text-neutral-500 dark:text-neutral-400 tracking-wide font-normal text-xs sm:text-sm md:text-md lg:text-lg mb-2">
              Processing Video
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 tracking-wide font-normal text-xs sm:text-sm md:text-md lg:text-lg">
              Downloading and trimming your clip...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="rounded-full h-16 w-16 bg-red-600/50 mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl">✕</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Processing Failed</h2>
            <p className="text-gray-600">
              Something went wrong. Please try again.
            </p>
          </>
        )}
      </div>

      {(status === "processing" || status === "pending") && (
        <div className="w-full bg-neutral-300 dark:bg-neutral-600/40 rounded-full h-2.5">
          <div
            className="bg-neutral-600 dark:bg-neutral-300 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
