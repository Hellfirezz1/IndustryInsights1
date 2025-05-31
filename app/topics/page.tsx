import { Metadata } from "next"
import { TopicsList } from "@/components/topics/topics-list"

export const metadata: Metadata = {
  title: "Available Topics - IndustryDigest",
  description: "Browse all available industry topics for your digests",
}

export default function TopicsPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Available Topics</h1>
        <p className="text-lg text-muted-foreground">
          Browse our curated list of industry topics. Select topics based on your subscription plan.
        </p>
      </div>
      
      <TopicsList />
    </div>
  )
}