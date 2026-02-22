"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProcessingStatus from "@/components/ui/ProcessingStatus";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";
import ClipGradient from "@/components/ui/ClipGradient";

export default function ClipPage() {
  const { user } = useUser();
  const params = useParams();
  const token = params.token as string;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [clip, setClip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600"></div>
      </div>
    );
  }

  const formatTimeLeft = (expiryDate: Date) => {
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600/50 mb-4">
          Error Something went wrong{" "}
        </h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!clip) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <h1 className="text-md sm:text-lg md:text-2xl font-bold mb-4">
          Clip Not Found
        </h1>
        <p className="text-gray-600">This clip doesn't exist or has expired.</p>
      </div>
    );
  }

  const isCreator = user?.id === clip.user_id;

  return (
    <div className="bg-white dark:bg-neutral-950 relative min-h-screen overflow-hidden">
      <ClipGradient />
      <div className="relative max-w-5xl mx-auto px-8 lg:px-4 py-18">
        {clip.status === "completed" ? (
          <>
            <div className="mb-4 sm:mb-8 flex flex-col gap-2">
              {isCreator && (
                <div className="">
                  <Link href={"/dashboard"}>
                    <button className="flex items-center justify-center gap-0 md:gap-1 py-2 w-17 sm:w-19 md:w-23 px-1 hover:shadow-stone-800/50 dark:hover:shadow-stone-200/20 hover:shadow-2xl hover:transition-shadow text-neutral-900 dark:text-neutral-100 transition-colors ease-in-out duration-200 border-neutral-500/50 dark:border-neutral-400/50 border rounded-none text-[10px] sm:text-xs md:text-sm bg-white dark:bg-neutral-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3 md:w-4 md:h-4"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                      Go Back
                    </button>
                  </Link>
                </div>
              )}
              <div className="flex justify-end sm:mb-0 mb-12">
                <button
                  onClick={toggleTheme}
                  className=" h-8 w-8
             flex items-center justify-center
             rounded-full
             border border-neutral-600/30
             bg-transparent
             text-neutral-700
             dark:text-neutral-200
             hover:bg-neutral-200/40
             dark:hover:bg-neutral-800/60
             transition-colors duration-200"
                >
                  {mounted &&
                    (theme === "light" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    ))}
                </button>
              </div>

              <div className="flex justify-between items-baseline">
                <h1 className="text-2xl sm:text-3xl font-sans bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100 font-medium">
                  <span className="text-4xl md:text-5xl lg:text-[48px] font-serif bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100">
                    {clip.sharer_name} <span>,</span>
                  </span>{" "}
                  clipped this for you
                </h1>
                <p className="text-neutral-600 hidden sm:block dark:text-neutral-300 tracking-wide font-medium text-[12px] sm:text-xs md:text-sm">
                  Created with <span className="font-bold">CutThatPart</span>
                </p>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 tracking-wide font-medium text-[12px] sm:text-xs md:text-sm">
                Expires in {formatTimeLeft(new Date(clip.expires_at))}
              </p>
              <p className="text-neutral-600 sm:hidden dark:text-neutral-300 tracking-wide font-medium text-[12px] sm:text-xs md:text-sm">
                Created with CutThatPart
              </p>
            </div>
            <VideoPlayer
              s3Url={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${clip.s3_key}`}
              sharerName={clip.sharer_name}
              shareToken={token}
              youtubeUrl={clip.youtube_url}
              userId={clip.user_id}
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
            <h1 className="text-2xl sm:text-3xl  bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100 text-center mb-8">
              Processing Your Clip
            </h1>
            <ProcessingStatus token={token} onComplete={handleComplete} />
          </>
        )}
      </div>
    </div>
  );
}
