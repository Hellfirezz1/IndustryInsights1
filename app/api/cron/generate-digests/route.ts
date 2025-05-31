import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Mark route as dynamic
export const dynamic = 'force-dynamic'

// Initialize Resend with free tier
const resend = new Resend(process.env.RESEND_API_KEY)

// Initialize Google AI (free tier)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!)

export async function GET(request: Request) {
  try {
    // Verify cron secret to ensure this is called by the scheduler
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all active users with their topics
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, niches, subscriptionstatus, trial_started_at')
      .eq('subscriptionstatus', 'active')
      .or('subscriptionstatus.eq.pending')

    if (usersError) throw usersError

    // Process each user
    for (const user of users) {
      // Skip if no topics selected
      if (!user.niches || user.niches.length === 0) continue

      // Check if user is in trial period
      if (user.subscriptionstatus === 'pending') {
        const trialStart = new Date(user.trial_started_at)
        const now = new Date()
        const daysInTrial = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24))
        
        // Skip if trial has ended
        if (daysInTrial >= 7) continue
      }

      // Process each topic for the user
      for (const topic of user.niches) {
        // Check if we already generated a digest for this topic recently
        const { data: latestDigest } = await supabase
          .rpc('get_latest_digest', {
            user_id: user.id,
            topic: topic
          })

        if (latestDigest && latestDigest.length > 0) {
          const lastDigestDate = new Date(latestDigest[0].created_at)
          const now = new Date()
          const daysSinceLastDigest = Math.floor((now.getTime() - lastDigestDate.getTime()) / (1000 * 60 * 60 * 24))
          
          // Skip if last digest was less than 3 days ago
          if (daysSinceLastDigest < 3) continue
        }

        // Generate content using Google AI
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const prompt = `Generate a concise industry digest about ${topic} for the past few days. Include key developments, trends, and insights. Format it in a clear, readable way with bullet points.`
        
        const result = await model.generateContent(prompt)
        const content = result.response.text()

        // Store digest in database
        const { error: digestError } = await supabase
          .from('digests')
          .insert({
            user_id: user.id,
            topic: topic,
            content: content,
            status: 'pending'
          })

        if (digestError) {
          console.error(`Error storing digest for user ${user.id}, topic ${topic}:`, digestError)
          continue
        }

        // Send email using Resend
        try {
          await resend.emails.send({
            from: 'IndustryDigest <digest@yourdomain.com>',
            to: user.email,
            subject: `Your ${topic} Industry Digest`,
            html: `
              <h1>Your ${topic} Industry Digest</h1>
              <div>${content}</div>
              <p>This digest was generated based on your selected topics.</p>
            `
          })

          // Update digest status to sent
          await supabase
            .from('digests')
            .update({ 
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('topic', topic)
            .eq('status', 'pending')
        } catch (emailError) {
          console.error(`Error sending email to user ${user.id}:`, emailError)
          
          // Update digest status to failed
          await supabase
            .from('digests')
            .update({ status: 'failed' })
            .eq('user_id', user.id)
            .eq('topic', topic)
            .eq('status', 'pending')
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error generating digests:', error)
    return NextResponse.json(
      { error: 'Failed to generate digests' },
      { status: 500 }
    )
  }
} 