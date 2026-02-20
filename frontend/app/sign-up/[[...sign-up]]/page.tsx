import { Container } from "@/components/Container";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <Container className="flex items-center justify-center min-h-screen">
        <SignUp />
      </Container>
    </div>
  );
}
