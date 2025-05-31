import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const { planId, amount, currency } = await request.json()

    // Create order
    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId: planId,
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
} 