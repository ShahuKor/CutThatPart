import Link from "next/link";

export default function Hero() {
  return (
    <div
      className="mb-14 md:mb-20 lg:mb-26 px-8 py-10 sm:py-15 relative "
      style={{
        backgroundImage: `radial-gradient(circle, #a8a29e 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    >
      {/* Light mode gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-white/0 via-white/60 to-white pointer-events-none dark:hidden" />
      {/* Dark mode gradient */}
      <div className="absolute inset-0 hidden dark:block bg-linear-to-b from-neutral-950/0 via-neutral-950/60 to-neutral-950 pointer-events-none" />

      <div className="mt-23 relative z-10">
        <div className="flex flex-col justify-start gap-2 sm:gap-3 lg:gap-0 md:gap-2">
          <div className="bg-neutral-800/90 border border-neutral-800/90 dark:bg-transparent dark:border dark:border-neutral-300/30 w-20 md:w-22 py-1  px-2">
            <p className="text-[10px] md:text-xs font-semibold tracking-tight text-neutral-100 dark:text-neutral-200 ">
              CutThatPart
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-serif bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100">
            Share Moments. Not Minutes
          </h1>

          <div className="flex flex-col gap-2 md:gap-4 font-medium text-neutral-800 dark:text-neutral-200">
            <h2 className="text-xs sm:text-md md:text-lg tracking-tight">
              Trim any YouTube video and send a clean,{" "}
              <span className="text-neutral-500 dark:text-neutral-400 font-stretch-100%">
                temporary clip link.
              </span>
            </h2>
            <p className="text-xs sm:text-sm md:text-md tracking-wide">
              No timestamps. Clip it Send it
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-3 md:mt-5">
          <div>
            <Link href={"/"}>
              <button className="border-stone-800 text-[10px] w-26 md:w-32 sm:w-28 dark:border-stone-200 border py-2 px-1 hover:bg-white dark:hover:bg-neutral-950 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors ease-in-out duration-300 hover:border-neutral-500/50 dark:hover:border-neutral-400/50 hover:border rounded-none sm:text-xs md:text-sm bg-stone-800 dark:bg-stone-100 text-white dark:text-neutral-900 flex items-center justify-center gap-2">
                Start Clipping
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 stroke-current stroke-[1.5]"
                >
                  <path d="M4 12h16M13 6l6 6-6 6" />
                </svg>
              </button>
            </Link>
          </div>
          <div>
            <Link href={"/"}>
              <button className="py-2 w-23 sm:w-28 md:w-32 px-1 hover:shadow-stone-800/50 dark:hover:shadow-stone-200/20 hover:shadow-2xl hover:transition-shadow text-neutral-900 dark:text-neutral-100 transition-colors ease-in-out duration-200 border-neutral-500/50 dark:border-neutral-400/50 border rounded-none text-[10px] sm:text-xs md:text-sm bg-white dark:bg-neutral-900">
                See how it works
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
