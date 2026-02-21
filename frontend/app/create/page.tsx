import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClipForm from "@/components/ui/ClipForm";
import { Container } from "@/components/Container";
import Link from "next/link";

export default async function CreatePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen">
      <Container className="px-4 md:px-7 py-25">
        <div className="mb-8 sm:mb-5 md:mb-6 lg:mb-7">
          <Link href="/dashboard">
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
        <div className="flex flex-col items-center sm:flex-row  w-full sm:justify-between sm:items-center gap-10 sm:gap-4">
          <div className="md:max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col gap-4">
            <h1 className="text-5xl md:text-5xl lg:text-[68px] font-serif bg-clip-text text-transparent bg-linear-to-t from-neutral-600 to-neutral-900 dark:from-neutral-400 dark:to-neutral-100">
              Create New Clip
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 tracking-wide font-normal text-xs sm:text-sm md:text-md lg:text-lg">
              Just Copy and Paste the Youtube Video in the given form, select
              the desired time stamp and click on Create Clip
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 tracking-wide font-medium text-[12px] sm:text-xs md:text-sm">
              Note : Max video duration limit is 10 minutes
            </p>
          </div>

          <div>
            <ClipForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
