export default function Features() {
  const card =
    "group relative bg-white dark:bg-neutral-950 overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-0.5";

  const overlay =
    "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-amber-50/60 dark:bg-yellow-900/15";

  return (
    <div className="px-8 py-16">
      <h2 className="mb-8 text-4xl lg:text-[60px] font-serif bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100">
        Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800">
        <div className={`lg:col-span-2 ${card} p-8 flex flex-col gap-4`}>
          <div className={overlay} />
          <div className="flex items-start gap-3 relative z-10">
            <span className="mt-1 text-neutral-400 dark:text-neutral-600 shrink-0 transition-colors duration-300 group-hover:text-amber-500 dark:group-hover:text-yellow-500">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg md:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Trim Up to 10 Minutes
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md">
                Choose exact start and end times and create frame-perfect clips
                up to 10 minutes long — 10× longer than YouTube's limit.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-4 flex items-center gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`h-6 w-1.5 transition-colors duration-300 ${
                  i < 14
                    ? "bg-neutral-800 dark:bg-neutral-200 group-hover:bg-amber-600 dark:group-hover:bg-yellow-400"
                    : "bg-neutral-200 dark:bg-neutral-800"
                }`}
                style={{ transitionDelay: `${i * 15}ms` }}
              />
            ))}
            <span className="ml-3 text-xs text-neutral-400 dark:text-neutral-600 font-mono">
              10:00
            </span>
          </div>
        </div>

        <div className={`${card} p-8 flex flex-col gap-3`}>
          <div className={overlay} />
          <span className="relative z-10 text-neutral-400 dark:text-neutral-600 transition-colors duration-300 group-hover:text-amber-500 dark:group-hover:text-yellow-500">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>
          <h3 className="relative z-10 text-lg md:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            No Downloads. No Quality Loss.
          </h3>
          <p className="relative z-10 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Runs entirely in your browser with zero uploads and zero
            compression, so your video stays in full resolution.
          </p>
        </div>

        <div className={`${card} p-8 flex flex-col gap-3`}>
          <div className={overlay} />
          <span className="relative z-10 text-neutral-400 dark:text-neutral-600 transition-colors duration-300 group-hover:text-amber-500 dark:group-hover:text-yellow-500">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="0" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </span>
          <h3 className="relative z-10 text-lg md:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Beautiful Share Page
          </h3>
          <p className="relative z-10 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Get a clean, distraction-free page with your trimmed clip, your
            name, the original video link, and a smooth dark/light mode toggle.
          </p>
          <div className="relative z-10 mt-3 flex items-center gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-900">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-600">
              <div className="w-3 h-3 bg-neutral-900 dark:bg-neutral-100" />
              <span>Dark</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-600">
              <div className="w-3 h-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700" />
              <span>Light</span>
            </div>
          </div>
        </div>

        <div className={`lg:col-span-2 ${card} p-8 flex flex-col gap-3`}>
          <div className={overlay} />
          <span className="relative z-10 text-neutral-400 dark:text-neutral-600 transition-colors duration-300 group-hover:text-amber-500 dark:group-hover:text-yellow-500">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </span>
          <h3 className="relative z-10 text-lg md:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            One-Click Sharing
          </h3>
          <p className="relative z-10 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md">
            Instantly share to WhatsApp or any platform with a fast,
            mobile-friendly experience.
          </p>
          <div className="relative z-10 mt-3 flex flex-wrap gap-2">
            {["WhatsApp", "Twitter / X", "Telegram", "Copy Link"].map(
              (platform) => (
                <span
                  key={platform}
                  className="text-xs px-3 py-1 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium transition-colors duration-300 group-hover:border-amber-300 dark:group-hover:border-yellow-700 group-hover:text-amber-700 dark:group-hover:text-yellow-400"
                >
                  {platform}
                </span>
              ),
            )}
          </div>
        </div>

        <div
          className={`md:col-span-2 lg:col-span-3 ${card} p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4`}
        >
          <div className={overlay} />
          <div className="relative z-10 flex flex-col gap-3 max-w-lg">
            <span className="text-neutral-400 dark:text-neutral-600 transition-colors duration-300 group-hover:text-amber-500 dark:group-hover:text-yellow-500">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </span>
            <h3 className="text-lg md:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Auto-Delete in 48 Hours
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Your clips automatically disappear after two days — no storage
              stress, no manual cleanup.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-1 shrink-0">
            {["48", ":", "00", ":", "00"].map((seg, i) => (
              <span
                key={i}
                className={`font-mono text-2xl md:text-3xl transition-colors duration-300 ${
                  seg === ":"
                    ? "text-neutral-300 dark:text-neutral-700 mx-1"
                    : "text-neutral-900 dark:text-neutral-100 font-semibold border border-neutral-200 dark:border-neutral-800 px-3 py-1 group-hover:border-amber-300 dark:group-hover:border-yellow-700 group-hover:text-amber-800 dark:group-hover:text-yellow-300"
                }`}
              >
                {seg}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
