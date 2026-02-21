"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ClipForm() {
  const router = useRouter();
  const { user } = useUser();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:10");
  const [sharerName, setSharerName] = useState(user?.firstName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const timeToSeconds = (time: string): number => {
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const startSeconds = timeToSeconds(startTime);
      const endSeconds = timeToSeconds(endTime);

      if (endSeconds - startSeconds > 600) {
        setError("Clip duration cannot exceed 10 minutes");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeUrl,
          startTime: startSeconds,
          endTime: endSeconds,
          sharerName: sharerName || "Anonymous",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create clip");
      }

      // Redirect to clip page
      router.push(`/clip/${data.token}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs sm:text-sm font-sans tracking-tight mb-2">
          YouTube URL
        </label>
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
          className="w-full px-4 py-2 border border-neutral-900/60 dark:border-neutral-400/50 focus:outline-none focus:ring-0 focus:border-inherit text-xs sm:text-[15px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-sans tracking-tight mb-2">
            Start Time (MM:SS)
          </label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="00:00"
            pattern="[0-9]{2}:[0-9]{2}"
            required
            className="w-full px-4 py-2 border border-neutral-900/60 dark:border-neutral-400/50 focus:outline-none focus:ring-0 focus:border-inherit text-xs sm:text-[15px]"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-sans tracking-tight mb-2">
            End Time (MM:SS)
          </label>
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="00:10"
            pattern="[0-9]{2}:[0-9]{2}"
            required
            className="w-full px-4 py-2 border border-neutral-900/60 dark:border-neutral-400/50 focus:outline-none focus:ring-0 focus:border-inherit text-xs sm:text-[15px]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-sans tracking-tight mb-2">
          Your Name (optional)
        </label>
        <input
          type="text"
          value={sharerName}
          onChange={(e) => setSharerName(e.target.value)}
          placeholder="Anonymous"
          className="w-full px-4 py-2 border border-neutral-900/60 dark:border-neutral-400/50 focus:outline-none focus:ring-0 focus:border-inherit text-xs sm:text-[15px]"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="block w-full py-2 text-center border-stone-800 text-[12px] dark:border-stone-200 border hover:bg-white dark:hover:bg-neutral-950 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors ease-in-out duration-300 hover:border-neutral-500/50 dark:hover:border-neutral-400/50 hover:border rounded-none sm:text-xs md:text-sm bg-stone-800 dark:bg-stone-100 text-white dark:text-neutral-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Clip..." : "Create Clip"}
      </button>
    </form>
  );
}
