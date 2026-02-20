import { Container } from "@/components/Container";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <Container className="flex items-center justify-center min-h-screen">
        <SignIn />
      </Container>
    </div>
  );
}
