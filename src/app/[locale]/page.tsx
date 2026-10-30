import { Header } from "@/src/components/home/Header";
import { HeroSection } from "@/src/components/home/heroSection/HeroSection";
import { Footer } from "@/src/components/home/Footer";
import { Marquee } from "@/src/components/home/Marquee";
import { AppMockup } from "@/src/components/home/AppMockup";
import { HowItWorks } from "@/src/components/home/HowItWorks";
import { CTASection } from "@/src/components/home/CTASection";

// Les utilisateurs connectés sont redirigés vers le dashboard par le proxy (src/proxy.ts).
const Home = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Header />
    <HeroSection />
    <Marquee />
    <AppMockup />
    <HowItWorks />
    <CTASection />
    <Footer />
  </div>
);

export default Home;
