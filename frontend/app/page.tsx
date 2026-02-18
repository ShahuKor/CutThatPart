import { Container } from "@/components/Container";
import Hero from "@/components/landing/Hero";

export default function Home() {
  return (
    <div className="bg-white dark:bg-neutral-950">
      <Container>
        <Hero />
      </Container>
    </div>
  );
}
