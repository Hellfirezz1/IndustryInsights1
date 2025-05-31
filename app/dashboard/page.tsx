import { Metadata } from "next"
import { DigestGrid } from "@/components/dashboard/digest-grid"
import { DigestList } from '@/components/dashboard/digest-list'

export const metadata: Metadata = {
  title: "Dashboard - IndustryDigest",
  description: "View your personalized industry digests",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Industry Digests</h1>
      <DigestList />
    </div>
  )
}