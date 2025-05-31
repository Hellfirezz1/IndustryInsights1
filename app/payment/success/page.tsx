"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TopicSelection } from '@/components/subscription/topic-selection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [showTopicSelection, setShowTopicSelection] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw sessionError
        }

        if (!session) {
          console.log('No session found, redirecting to login')
          const returnUrl = '/payment/success'
          router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
          return
        }

        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('subscriptionstatus, niches, trial_started_at')
          .eq('id', session.user.id)
          .single()

        if (userError) {
          console.error('User data error:', userError)
          throw userError
        }

        console.log('User data:', userData)

        // Show topic selection
        setShowTopicSelection(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking auth:', error)
        setError('Failed to verify authentication')
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/subscription')}
              className="w-full"
            >
              Return to Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showTopicSelection) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome to Your Free Trial!</CardTitle>
            <CardDescription>
              Your 7-day free trial has started. You won't be charged until the trial ends.
              Select your topics of interest to get started.
            </CardDescription>
          </CardHeader>
        </Card>
        <TopicSelection />
      </div>
    )
  }

  return null
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}