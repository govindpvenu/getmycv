import HeroSection from "@/components/tailark/hero-section";
import FooterSection from "@/components/tailark/footer";
import CallToAction from "@/components/tailark/call-to-action";
import StatsSection from "@/components/tailark/stats";
import Features1 from "@/components/tailark/features-1";
import Features2 from "@/components/tailark/features-2";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Features1 />
      <Features2 />
      <StatsSection />
      <CallToAction />
      <FooterSection />
    </main>
  );
}
