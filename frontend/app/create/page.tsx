import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClipForm from "@/components/ui/ClipForm";

export default async function CreatePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Clip</h1>
      <ClipForm />
    </div>
  );
}
