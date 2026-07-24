import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { DashboardPreview } from "@/components/dashboard-preview";
import { SignatureInteraction } from "@/components/signature-interaction";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <DashboardPreview />
        <SignatureInteraction />
      </main>
      <Footer />
    </>
  );
}
