import { Metadata } from "next"
import { UserProfile } from "@/components/profile/user-profile"

export const metadata: Metadata = {
  title: "Your Profile - IndustryDigest",
  description: "Manage your subscription and preferences",
}

export default function ProfilePage() {
  return (
    <div className="container py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and subscription settings
        </p>
      </div>
      
      <UserProfile />
    </div>
  )
}