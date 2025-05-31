import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export const metadata: Metadata = {
  title: "Access Denied - IndustryDigest",
  description: "Subscription required to access this content",
}

export default function AccessDeniedPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <ShieldAlert size={36} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6 text-muted-foreground">
          Your trial has expired or you're not subscribed to access this content.
          Subscribe now to unlock all industry insights.
        </p>
        
        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/subscribe">Subscribe Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}