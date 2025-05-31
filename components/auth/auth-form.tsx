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

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

interface AuthFormProps {
  returnUrl?: string | null;
  isRegister?: boolean;
}

export function AuthForm({ returnUrl, isRegister = false }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof authSchema>) => {
    setIsLoading(true)
    setError(null)

    try {
      if (isRegister) {
        // Sign up
        const { error: signUpError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (signUpError) throw signUpError

        toast.success('Registration successful! Please check your email to verify your account.')
        router.push('/auth/confirm')
      } else {
        // Sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })

        if (signInError) throw signInError

        // Get user data after successful login
        const { data: userData } = await supabase
          .from('users')
          .select('subscriptionstatus, niches, trial_started_at')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single()

        toast.success('Login successful')

        // Use setTimeout to ensure state updates are complete before navigation
        setTimeout(() => {
          if (returnUrl) {
            router.replace(decodeURIComponent(returnUrl))
          } else if (!userData?.niches || userData.niches.length === 0) {
            router.replace('/payment/success')
          } else {
            router.replace('/dashboard')
          }
        }, 100)
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      setError(error.error_description || error.message || 'Authentication failed')
      toast.error(error.error_description || error.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isRegister ? 'Create Account' : 'Welcome Back'}</CardTitle>
        <CardDescription>
          {isRegister 
            ? 'Enter your email to create your account'
            : 'Sign in to your account to continue'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading 
              ? (isRegister ? 'Creating account...' : 'Signing in...') 
              : (isRegister ? 'Create account' : 'Sign in')
            }
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal"
            onClick={() => router.push(isRegister ? '/login' : '/register')}
          >
            {isRegister ? 'Sign in' : 'Create one'}
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}