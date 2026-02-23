import Image from "next/image";
import Link from "next/link";

export default function CreateFirstClip() {
  return (
    <div className="px-8 py-0 pb-10 lg:pt-14 lg:pb-30">
      <h2 className="mb-10 text-4xl lg:text-[60px] font-serif bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100">
        Create Your First Clip
      </h2>

      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12">
        <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-2xl">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-3 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400" />
            </div>

            <div className="flex-1 mx-2 sm:mx-4">
              <div className="bg-white dark:bg-neutral-700 rounded-md px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-neutral-400 dark:text-neutral-500 text-center truncate">
                cutthatpart.com/clip/rJoH3UKmA2
              </div>
            </div>
          </div>

          <div className="relative w-full aspect-video bg-neutral-50 dark:hidden block">
            <Image
              src="/sharepagefulllight.png"
              alt="Dashboard preview"
              fill
              className="object-cover object-top"
            />
          </div>

          <div className="relative w-full aspect-video bg-neutral-900 dark:block hidden">
            <Image
              src="/sharepage.png"
              alt="Dashboard preview"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Link href={"/dashboard"}>
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
      </div>
    </div>
  );
}
