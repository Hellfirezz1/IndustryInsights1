import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received payment verification request:', body)

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planId,
    } = body

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error('Missing required payment details:', { razorpay_payment_id, razorpay_order_id, razorpay_signature })
      return NextResponse.json(
        { error: 'Missing required payment details' },
        { status: 400 }
      )
    }

    // Verify signature
    const signatureBody = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(signatureBody.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature
    console.log('Signature verification:', { isAuthentic, expectedSignature, receivedSignature: razorpay_signature })

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Get access token from Authorization header
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.split(' ')[1]

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token provided' },
        { status: 401 }
      )
    }

    // Create a Supabase client with the user's access token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } }
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error getting user:', userError)
      return NextResponse.json(
        { error: 'Failed to get user' },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    console.log('Updating user subscription:', { userId: user.id, planId })

    // Update user's subscription status
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        subscription_status: 'trial',
        trial_started_at: new Date().toISOString(),
        selected_plan: planId,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        payment_status: 'authorized',
        last_payment_date: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user subscription:', updateError)
      throw updateError
    }

    console.log('Successfully updated user subscription:', updatedUser)

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
} 