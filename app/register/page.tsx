'use client'

import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/auth-form'

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    }>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign up for an account
            </p>
          </div>
          <AuthForm isRegister />
        </div>
      </div>
    </Suspense>
  )
}