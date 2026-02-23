import { Container } from "@/components/Container";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <div className="bg-white dark:bg-neutral-950">
      <Container>
        <Hero />
        <HowItWorks />
        <Features />
      </Container>
    </div>
  );
}
