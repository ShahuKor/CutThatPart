import { Container } from "@/components/Container";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <div
        className="min-h-screen px-8 md:pt-20 md:pb-10 relative"
        style={{
          backgroundImage: `radial-gradient(circle, #a8a29e 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-white/0 via-white/60 to-white pointer-events-none" />

        <div className="mt-23 relative z-10">
          <div className=" flex flex-col justify-start ">
            <h1 className="text-[120px] font-serif bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900">
              CutThatPart
            </h1>
            <div className="flex flex-col gap-4 font-medium text-neutral-800">
              <h2 className="text-lg tracking-tight ">
                Trim any YouTube video and send a clean,{" "}
                <span className=" text-neutral-500 font-stretch-100%">
                  temporary clip link.
                </span>
              </h2>
              <p className="text-md tracking-wide">
                No timestamps. Clip it Send it
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <div>
              <Link href={"/"}>
                <button className="border-stone-800 border py-2 w-32 px-1 hover:bg-white hover:text-neutral-900 transition-colors ease-in-out duration-300 hover:border-neutral-500/50 hover:border rounded-none text-sm bg-stone-800 text-white flex items-center justify-center gap-2">
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
                <button className="py-2 w-32 px-1 hover:shadow-stone-800/50  hover:shadow-2xl hover:transition-shadow  text-neutral-900 transition-colors ease-in-out duration-200 border-neutral-500/50 border  rounded-none text-sm bg-white">
                  See how it works
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
