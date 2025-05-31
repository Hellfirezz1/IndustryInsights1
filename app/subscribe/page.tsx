import { Metadata } from "next"
import { PaymentForm } from "@/components/subscription/payment-form"

export const metadata: Metadata = {
  title: "Subscribe - IndustryDigest",
  description: "Subscribe to IndustryDigest for premium curated industry insights",
}

export default function SubscribePage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-xl text-center mb-10">
        <h1 className="text-3xl font-bold">Subscribe to IndustryDigest</h1>
        <p className="mt-3 text-muted-foreground">
          Get premium access to curated industry insights
        </p>
      </div>
      
      <PaymentForm />
    </div>
  )
}