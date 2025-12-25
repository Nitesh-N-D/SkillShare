import { useNavigate } from "react-router-dom";

import { Navbar } from "../components/navbar";
import { HeroSection } from "../components/hero-section";
import { FeatureCards } from "../components/feature-cards";
import { StatsSection } from "../components/stats-section";
import { CTASection } from "../components/cta-section";
import { Footer } from "../components/footer";
import { JSX } from "react";

export function LandingPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={() => navigate("/login")} />

      <div className="pt-16 md:pt-20">
        <HeroSection onGetStarted={() => navigate("/login")} />
        <FeatureCards />
        <StatsSection />
        <CTASection onJoinClick={() => navigate("/login")} />
        <Footer />
      </div>
    </div>
  );
}
