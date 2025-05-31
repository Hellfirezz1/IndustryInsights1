import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Verify payment status from Instamojo webhook
    if (data.payment_status === 'Credit') {
      const userId = data.buyer_name // We stored userId as buyer_name in payment request

      // Update user subscription status
      await supabase
        .from('users')
        .update({ subscriptionStatus: 'active' })
        .eq('id', userId)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false })
  } catch (error) {
    console.error('Payment webhook error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}