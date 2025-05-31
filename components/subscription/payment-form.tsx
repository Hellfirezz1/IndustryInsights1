"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import Script from 'next/script'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19900, // Amount in paise
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
    price: 34900, // Amount in paise
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

export function PaymentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const router = useRouter()

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const plan = plans.find(p => p.id === selectedPlan)
      if (!plan) {
        throw new Error('Invalid plan selected')
      }

      // Create order on the server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.price,
          currency: 'INR',
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
        description: `${plan.name} Plan - 7 Day Free Trial`,
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
            // Get the user's access token
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;

            // Verify payment on the server
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (!verifyResponse.ok) {
              console.error('Payment verification response:', verifyData)
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            // Ensure the user is logged in
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) {
              // If not logged in, sign in the user
              const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: user?.email || '',
                password: 'your-password-here', // Note: This is not secure. Use a proper method to get the password.
              })
              if (signInError) {
                console.error('Error signing in user:', signInError)
                throw new Error('Failed to sign in user')
              }
            }

            // Redirect to success page
            router.push('/payment/success')
          } catch (error: any) {
            console.error('Payment verification error:', error)
            console.error('Full error details:', {
              message: error.message,
              response: error.response,
              data: error.data
            })
            toast.error(error.message || 'Payment verification failed')
            setIsLoading(false)
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
      toast.error(error.message || 'Payment failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="max-w-4xl mx-auto">
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
                  <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
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
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start Your Free Trial</CardTitle>
            <CardDescription>
              Try IndustryDigest free for 7 days. No payment required during trial.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>7-day free trial</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">After trial, billed monthly</span>
                  <span className="font-medium">
                    ₹{(plans.find(p => p.id === selectedPlan)?.price || 0) / 100}.00
                  </span>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4 text-sm">
                <p>
                  Your free trial starts today and ends in 7 days. You won't be charged
                  until your trial ends, and you can cancel anytime before then.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handlePayment} 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Start Free Trial'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}