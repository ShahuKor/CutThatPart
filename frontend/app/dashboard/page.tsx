"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ClipCard from "@/components/ui/ClipCard";
import { Container } from "@/components/Container";

export default function DashboardPage() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClips() {
      try {
        const response = await fetch("/api/clips/user");
        const data = await response.json();
        setClips(data.clips || []);
      } catch (error) {
        console.error("Failed to fetch clips:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClips();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen">
      <Container className="px-4 py-8">
        <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-9">
          <Link href={"/"}>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl  bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100">
            Your Clips
          </h1>
          <div>
            <Link href="/create">
              <button className="border-stone-800 text-[10px] w-26 md:w-32 sm:w-28 dark:border-stone-200 border py-2 px-1 hover:bg-white dark:hover:bg-neutral-950 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors ease-in-out duration-300 hover:border-neutral-500/50 dark:hover:border-neutral-400/50 hover:border rounded-none sm:text-xs md:text-sm bg-stone-800 dark:bg-stone-100 text-white dark:text-neutral-900 flex items-center justify-center gap-2">
                Create Clip
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 stroke-current stroke-[1.5]"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {clips.length === 0 ? (
          <div className="text-start">
            <p className="text-neutral-600 dark:text-neutral-300 mb-15 text-sm md:text-md lg:text-lg">
              You haven't created any clips yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clips.map((clip: any) => (
              <ClipCard key={clip.id} clip={clip} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
