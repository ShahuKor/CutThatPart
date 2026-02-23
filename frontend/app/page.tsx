import { Container } from "@/components/Container";
import CreateFirstClip from "@/components/landing/CreateFirstClip";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <div className="bg-white dark:bg-neutral-950">
      <Container>
        <Hero />
        <HowItWorks />
        <Features />
        <CreateFirstClip />
        <Footer />
      </Container>
    </div>
  );
}
