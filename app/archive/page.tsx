import { Metadata } from "next"
import { DigestArchive } from "@/components/archive/digest-archive"

export const metadata: Metadata = {
  title: "Digest Archive - IndustryDigest",
  description: "Browse and search all past industry digests",
}

export default function ArchivePage() {
  return (
    <div className="container py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Digest Archive</h1>
        <p className="text-muted-foreground">
          Browse all past digests from your selected industries
        </p>
      </div>
      
      <DigestArchive />
    </div>
  )
}