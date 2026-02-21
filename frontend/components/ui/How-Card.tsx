import { HowCardProps } from "@/types/types";

export default function HowCard({ src, cardtitle, description }: HowCardProps) {
  return (
    <div
      className="
      group relative w-full max-w-sm rounded-2xl overflow-hidden
      border border-neutral-200/60 dark:border-neutral-700/40
      bg-white dark:bg-neutral-900
      shadow-sm hover:shadow-md
      transition-shadow duration-300
    "
    >
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={src}
          alt={cardtitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div
          className="
          absolute inset-x-0 bottom-0 h-24
          bg-linear-to-t from-white dark:from-neutral-900 to-transparent
          pointer-events-none
        "
        />
      </div>

      <div className="px-5 pb-5 -mt-3 relative z-10">
        <h3 className="text-sm md:text-base font-semibold text-neutral-800 dark:text-neutral-100 leading-snug mb-1.5">
          {cardtitle}
        </h3>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
