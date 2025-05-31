import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - IndustryDigest",
  description: "Login to your IndustryDigest account",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 