import HowCard from "../ui/How-Card";

const cardItems = [
  {
    srcLight: "/pasteurldark.png",
    srcDark: "/pasteurllight.png",
    cardtitle: "Drop your video Link",
    description: "Get the link of the video that you want to get clipped",
  },
  {
    srcLight: "/timestampdark.png",
    srcDark: "/timestamplight.png",
    cardtitle: "Select the timestamp",
    description: "Manually enter the timestamps which you want to get clipped",
  },
  {
    srcLight: "/sharecliplightfinal.png",
    srcDark: "/shareclipdarkfinal.png",
    cardtitle: "Share the Video with Personalised link",
    description:
      "Your clipped video is ready with personalised link to be shared with anyone",
  },
];

const diagonalOffsets = ["lg:mt-0", "lg:mt-40", "lg:mt-80"];

export default function HowItWorks() {
  return (
    <div className="px-8 py-10 lg:py-16">
      <div className="flex flex-col">
        <h2 className="mb-8 text-4xl lg:text-[60px] font-serif bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100">
          How it Works
        </h2>

        <div className="flex flex-col lg:flex-row lg:items-start gap-10 sm:gap-8 lg:gap-4">
          {cardItems.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-4 w-full lg:flex-1 ${diagonalOffsets[index]}`}
            >
              <HowCard
                srcDark={item.srcDark}
                srcLight={item.srcLight}
                cardtitle={item.cardtitle}
                description={item.description}
              />

              {/* Arrow between cards — hidden on last card and on mobile */}
              {index < cardItems.length - 1 && (
                <div className="hidden lg:flex items-center justify-center mt-20 text-neutral-300 dark:text-neutral-600 shrink-0">
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
