import Link from "next/link";

export default function Footer() {
  return (
    <div className="h-55 sm:h-69 md:h-83 lg:h-120 px-4 flex flex-col border-t border-neutral-400/30">
      <div className="px-4 lg:px-14 flex flex-col gap-12 md:gap-18 lg:gap-30">
        <div className="flex justify-between mt-10  sm:mt-12 lg:mt-20 font-sans font-semibold text-neutral-500 dark:text-neutral-600">
          <div>
            <p className="text-[10px] sm:text-sm md:text-md lg:text-lg tracking-wide">
              Made By Shahu Kor
            </p>
            <p className="text-[8px] sm:text-sm">
              <a href="https://www.shahukor.com">Contact : shahukor.com</a>
            </p>
          </div>

          <Link
            className="text-[10px] sm:text-sm md:text-md lg:text-lg "
            href="/dashboard"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="flex justify-center items-center">
          <h3 className="font-semibold tracking-tight text-6xl sm:text-8xl md:text-9xl lg:text-[180px] dark:text-neutral-700/20 text-neutral-400/20">
            CutThatPart
          </h3>
        </div>
      </div>
    </div>
  );
}
