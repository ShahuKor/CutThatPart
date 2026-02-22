"use client";

import { useUser } from "@clerk/nextjs";

interface VideoPlayerProps {
  s3Url: string;
  sharerName?: string;
  shareToken: string;
  youtubeUrl: string;
  userId?: string;
}

export default function VideoPlayer({
  s3Url,
  sharerName,
  shareToken,
  youtubeUrl,
  userId,
}: VideoPlayerProps) {
  const { user } = useUser();
  const shareUrl = `${window.location.origin}/clip/${shareToken}`;

  const isCreator = user?.id === userId;

  const handleWhatsAppShare = () => {
    const text = `Check out this video clip${sharerName ? ` shared by ${sharerName}` : ""}!`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`,
      "_blank",
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
        <video src={s3Url} controls className="w-full h-full" autoPlay>
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex sm:flex-row flex-col items-start sm:gap-0 gap-4 sm:justify-between">
        {isCreator && (
          <div className="flex sm:flex-row flex-col gap-4">
            <button
              onClick={handleWhatsAppShare}
              className="flex justify-center items-center gap-2 py-1.5 md:py-2 w-34 sm:w-39 md:w-45 md:px-2 hover:shadow-stone-800/50 dark:hover:shadow-stone-200/20 hover:shadow-2xl hover:transition-shadow text-neutral-900 dark:text-neutral-100 transition-colors ease-in-out duration-200 border-neutral-500/50 dark:border-neutral-400/50 border rounded-none text-[10px] sm:text-xs md:text-sm bg-white dark:bg-neutral-900 hover:text-green-800 dark:hover:text-neutral-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Share on WhatsApp
            </button>

            <button
              onClick={handleCopyLink}
              className="border-stone-800 text-[10px] w-23 sm:w-25 md:w-32 dark:border-none border py-1 md:py-2 md:px-1 hover:bg-white dark:hover:bg-neutral-950 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors ease-in-out duration-300 hover:border-neutral-500/50 dark:hover:border-neutral-400/50 hover:border rounded-none sm:text-xs md:text-sm bg-stone-800 dark:bg-stone-100 text-white dark:text-neutral-900 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Link
            </button>
          </div>
        )}
        {!isCreator && (
          <div className="flex justify-center sm:justify-start w-full items-center">
            <p className="text-[10px] font-medium transition-colors ease-in-out duration-300 sm:text-xs md:text-sm text-neutral-900 dark:text-neutral-300">
              <a href={youtubeUrl}>Watch The Full Video</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
