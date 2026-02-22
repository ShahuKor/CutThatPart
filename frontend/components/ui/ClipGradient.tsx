export default function ClipGradient() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 10% 5%,  rgba(251,191,36,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 55% 45% at 90% 88%, rgba(245,158,11,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 60% 20%, rgba(253,230,138,0.20) 0%, transparent 50%),
            #fafaf8
          `,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          background: `
            radial-gradient(ellipse 75% 55% at 10% 8%,  rgba(60,57,52,0.70) 0%, transparent 60%),
            radial-gradient(ellipse 55% 45% at 88% 88%, rgba(45,43,38,0.60) 0%, transparent 55%),
            #0a0a0a
          `,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.028] dark:opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent dark:via-neutral-700/50"
      />
    </>
  );
}
