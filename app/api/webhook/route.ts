import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      )
    }

    const body = await request.text()
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)

    switch (event.event) {
      case 'payment.authorized':
        // Payment was successful
        await handlePaymentAuthorized(event.payload.payment.entity)
        break

      case 'payment.failed':
        // Payment failed
        await handlePaymentFailed(event.payload.payment.entity)
        break

      case 'subscription.charged':
        // Subscription payment was successful
        await handleSubscriptionCharged(event.payload.subscription.entity)
        break

      case 'subscription.cancelled':
        // Subscription was cancelled
        await handleSubscriptionCancelled(event.payload.subscription.entity)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentAuthorized(payment: any) {
  // Update payment status in database
  const { error } = await supabase
    .from('users')
    .update({
      payment_status: 'authorized',
      last_payment_date: new Date().toISOString(),
    })
    .eq('payment_id', payment.id)

  if (error) {
    console.error('Error updating payment status:', error)
  }
}

async function handlePaymentFailed(payment: any) {
  // Update payment status in database
  const { error } = await supabase
    .from('users')
    .update({
      payment_status: 'failed',
      last_payment_error: payment.error_description,
    })
    .eq('payment_id', payment.id)

  if (error) {
    console.error('Error updating payment status:', error)
  }
}

async function handleSubscriptionCharged(subscription: any) {
  // Update subscription status in database
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      last_payment_date: new Date().toISOString(),
    })
    .eq('subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription status:', error)
  }
}

async function handleSubscriptionCancelled(subscription: any) {
  // Update subscription status in database
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'cancelled',
      subscription_end_date: new Date().toISOString(),
    })
    .eq('subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription status:', error)
  }
} 