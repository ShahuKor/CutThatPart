import HowCard from "../ui/How-Card";

const cardItems = [
  {
    src: "/demo.jpg",
    cardtitle: "Drop your video Link",
    description: "Get the link of the video that you want to get clipped",
  },
  {
    src: "/demo.jpg",
    cardtitle: "Select the timestamp",
    description: "Manually enter the timestamps which you want to get clipped",
  },
  {
    src: "/demo.jpg",
    cardtitle: "Share the Video with Personlised link",
    description:
      "Your clipped video is ready with personalised link to be shared with anyone",
  },
];

const diagonalOffsets = ["md:mt-0", "md:mt-16", "md:mt-32"];

export default function HowItWorks() {
  return (
    <div className="px-8 pt-5 pb-40">
      <div className="flex flex-col">
        <h2 className="mb-6 md:mb-13 text-3xl md:text-4xl lg:text-[60px] font-serif bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100">
          How it Works
        </h2>
        {/* Mobile: flex-col / Desktop: diagonal staircase */}
        <div className="flex flex-col gap-4 md:flex md:flex-row md:items-start md:gap-4">
          {cardItems.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-4 w-full md:w-auto md:flex-1 ${
                diagonalOffsets[index]
              }`}
            >
              <HowCard
                src={item.src}
                cardtitle={item.cardtitle}
                description={item.description}
              />

              {/* Arrow between cards — hidden on last, hidden on mobile */}
              {index < cardItems.length - 1 && (
                <div className="hidden md:flex items-end pb-6 text-neutral-300 dark:text-neutral-600 shrink-0">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="rotate-45"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
