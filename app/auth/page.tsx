import { Metadata } from "next"
import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Authentication - IndustryDigest",
  description: "Login or register to access curated industry insights",
}

export default function AuthPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-xl text-center mb-10">
        <h1 className="text-3xl font-bold">Welcome to IndustryDigest</h1>
        <p className="mt-3 text-muted-foreground">
          Sign in or create an account to access curated insights
        </p>
      </div>
      
      <AuthForm />
    </div>
  )
}