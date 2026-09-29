import { createFileRoute } from '@tanstack/react-router';
import { Nav } from '@/components/marketing/Nav';
import { Hero } from '@/components/marketing/Hero';
import { Problem } from '@/components/marketing/Problem';
import { Features } from '@/components/marketing/Features';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Pricing } from '@/components/marketing/Pricing';
import { EmailCapture } from '@/components/marketing/EmailCapture';
import { Footer } from '@/components/marketing/Footer';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Nav />
      <main>
        <Hero />

        <Problem />

        <Features />

        <HowItWorks />

        <Pricing />

        <EmailCapture />
      </main>
      <Footer />
    </div>
  );
}
