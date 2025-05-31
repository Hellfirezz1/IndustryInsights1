"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19900,
    description: 'Perfect for focused learning in one industry',
    features: [
      'Weekly curated digest',
      'Choose 1 topic',
      'Email delivery',
      'Basic support',
      'Access to digest archive'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 34900,
    description: 'For professionals tracking multiple industries',
    features: [
      'Digest every 3 days',
      'Choose up to 3 topics',
      'Email + Telegram delivery',
      'Custom topic requests',
      'Early access to beta features',
      'Priority support',
      'Access to digest archive'
    ],
    popular: true
  }
]

export function SubscriptionManagement({ 
  currentPlan,
  subscriptionStatus,
  trialEndDate,
}: { 
  currentPlan: string
  subscriptionStatus: string
  trialEndDate: string | null
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(currentPlan)
  const router = useRouter()

  const handlePlanChange = async () => {
    setIsLoading(true)
    try {
      // Create order for plan change
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          amount: plans.find(p => p.id === selectedPlan)?.price,
          currency: 'INR',
          isPlanChange: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'IndustryDigest',
        description: `Change to ${plans.find(p => p.id === selectedPlan)?.name} Plan`,
        order_id: order.id,
        prefill: {
          method: 'upi',
        },
        config: {
          display: {
            blocks: {
              upi: {
                preferred: true,
              },
              other: {
                preferred: false,
              },
            },
            sequence: ['block.upi', 'block.other'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async function (response: any) {
          try {
            // Verify payment on the server
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planId: selectedPlan,
                isPlanChange: true,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed')
            }

            toast.success('Plan changed successfully')
            router.refresh()
          } catch (error: any) {
            console.error('Payment verification error:', error)
            toast.error(error.message || 'Payment verification failed')
          }
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false)
          }
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to change plan')
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      toast.success('Subscription cancelled successfully')
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to cancel subscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            {subscriptionStatus === 'trial' 
              ? `You are currently in your free trial period. Trial ends on ${new Date(trialEndDate!).toLocaleDateString()}`
              : 'You have an active subscription'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Current Plan</h3>
                <p className="text-muted-foreground">
                  {plans.find(p => p.id === currentPlan)?.name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ₹{(plans.find(p => p.id === currentPlan)?.price || 0) / 100}/month
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscriptionStatus === 'trial' ? 'Free trial' : 'Billed monthly'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative ${
              selectedPlan === plan.id ? 'border-primary' : ''
            } ${plan.popular ? 'shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <RadioGroup 
                  value={selectedPlan} 
                  onValueChange={setSelectedPlan}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={plan.id} id={plan.id} />
                    <Label htmlFor={plan.id}>Select</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold">₹{(plan.price / 100).toFixed(2)}</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <Button
          className="flex-1"
          onClick={handlePlanChange}
          disabled={isLoading || selectedPlan === currentPlan}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Change Plan'
          )}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={isLoading}
            >
              Cancel Subscription
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your current billing period.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelSubscription}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes, Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
} 