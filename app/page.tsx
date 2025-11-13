import HeroSection from "@/components/tailark/hero-section";
import FooterSection from "@/components/tailark/footer";
import CallToAction from "@/components/tailark/call-to-action";
import StatsSection from "@/components/tailark/stats";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <CallToAction />
      <FooterSection />
    </main>
  );
}
