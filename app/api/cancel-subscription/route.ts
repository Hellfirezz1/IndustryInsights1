import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import Razorpay from 'razorpay'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Get user's subscription details
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('subscription_id, subscription_status')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      throw fetchError
    }

    if (!userData?.subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Cancel subscription in Razorpay
    await razorpay.subscriptions.cancel(userData.subscription_id)

    // Update user's subscription status
    const { error: updateError } = await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled',
        subscription_end_date: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
} 