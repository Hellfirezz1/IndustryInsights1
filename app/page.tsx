import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { DigestPreview } from "@/components/home/digest-preview"
import { PricingSection } from "@/components/home/pricing-section"
import { CtaSection } from "@/components/home/cta-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <DigestPreview />
      <PricingSection />
      <CtaSection />
    </>
  )
}