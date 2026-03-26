import { redirect } from "next/navigation";
import { Header } from "@/src/components/home/Header";
import { HeroSection } from "@/src/components/home/heroSection/HeroSection";
import { Footer } from "@/src/components/home/Footer";
import { Marquee } from "@/src/components/home/Marquee";
import { AppMockup } from "@/src/components/home/AppMockup";
import { HowItWorks } from "@/src/components/home/HowItWorks";
import { CTASection } from "@/src/components/home/CTASection";
import { getToken } from "@/src/lib/auth";

const Home = async () => {
  const token = await getToken();
  if (token) {
    redirect("/dashboard");
  }

  return (
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
};

export default Home;
