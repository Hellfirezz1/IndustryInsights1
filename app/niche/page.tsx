import { Metadata } from "next"
import { NicheSelector } from "@/components/niche/niche-selector"

export const metadata: Metadata = {
  title: "Select Your Niches - IndustryDigest",
  description: "Customize your content by selecting industries you're interested in",
}

export default function NichePage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-10">
        <h1 className="text-3xl font-bold">Personalize Your Experience</h1>
        <p className="mt-3 text-muted-foreground">
          Choose industries you're interested in to receive relevant digests
        </p>
      </div>
      
      <NicheSelector />
    </div>
  )
}