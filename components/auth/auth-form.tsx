"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

interface AuthFormProps {
  returnUrl?: string | null;
}

export function AuthForm({ returnUrl }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    setError(null)

    try {
      // First, try to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (signInError) {
        // If sign in fails, try to update the user's metadata and sign in again
        const { data: { user }, error: getUserError } = await supabase.auth.getUser()
        
        if (user) {
          // Update user metadata to mark email as verified
          const { error: updateError } = await supabase.auth.updateUser({
            data: { email_verified: true }
          })

          if (updateError) throw updateError

          // Try signing in again
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          })

          if (retryError) throw retryError
        } else {
          throw signInError
        }
      }

      // Get user data after successful login
      const { data: userData } = await supabase
        .from('users')
        .select('subscriptionstatus, niches, trial_started_at')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single()

      console.log('User data after login:', userData)
      toast.success('Login successful')

      // Use setTimeout to ensure state updates are complete before navigation
      setTimeout(() => {
        console.log('Attempting navigation...')
        // If there's a return URL, redirect to it
        if (returnUrl) {
          console.log('Redirecting to return URL:', returnUrl)
          router.replace(decodeURIComponent(returnUrl))
        } else if (!userData?.niches || userData.niches.length === 0) {
          console.log('Redirecting to topic selection')
          router.replace('/payment/success')
          // Force a refresh after navigation
          window.location.href = '/payment/success'
        } else {
          console.log('Redirecting to dashboard')
          router.replace('/dashboard')
          // Force a refresh after navigation
          window.location.href = '/dashboard'
        }
      }, 100)

    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.error_description || error.message || 'Failed to login')
      toast.error(error.error_description || error.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...loginForm.register('email')}
            />
            {loginForm.formState.errors.email && (
              <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...loginForm.register('password')}
            />
            {loginForm.formState.errors.password && (
              <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Button variant="link" className="p-0" onClick={() => router.push('/register')}>
            Sign up
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}