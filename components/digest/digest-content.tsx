"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { getDigestById, supabase } from '@/lib/supabase'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Digest } from '@/types'
import { Bookmark, Share2 } from 'lucide-react'

interface DigestContentProps {
  digestId: string
}

export function DigestContent({ digestId }: DigestContentProps) {
  const [digest, setDigest] = useState<Digest | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    const fetchDigest = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/auth')
          return
        }
        
        const { data: userData } = await supabase
          .from('users')
          .select('subscriptionStatus')
          .eq('id', session.user.id)
          .single()
          
        if (!userData || (userData.subscriptionStatus !== 'active' && userData.subscriptionStatus !== 'trial')) {
          router.push('/access-denied')
          return
        }
        
        // Fetch the digest, ensuring it belongs to the current user
        const digestData = await getDigestById(digestId, session.user.id)
        if (!digestData) {
          router.push('/dashboard')
          return
        }
        
        setDigest(digestData)
      } catch (error) {
        console.error('Error fetching digest:', error)
        toast.error('Failed to load digest content')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDigest()
  }, [digestId, router])
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>
    )
  }
  
  if (!digest) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Digest Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The digest you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild>
          <a href="/dashboard">Back to Dashboard</a>
        </Button>
      </Card>
    )
  }
  
  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{digest.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          <time dateTime={digest.date}>
            {format(new Date(digest.date), 'MMMM d, yyyy')}
          </time>
          <div className="flex items-center">
            <div className="w-1 h-1 rounded-full bg-muted-foreground mx-2" />
            <span>5 min read</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {digest.topics.map(topic => (
            <Badge key={topic} variant="secondary">{topic}</Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
        <p className="text-lg font-medium">{digest.summary}</p>
        <div dangerouslySetInnerHTML={{ __html: digest.content }} />
      </div>
      
      <div className="mt-12 pt-6 border-t">
        <h3 className="text-lg font-medium mb-4">Related Topics</h3>
        <div className="flex flex-wrap gap-2">
          {digest.topics.map(topic => (
            <Badge key={topic} variant="outline">{topic}</Badge>
          ))}
        </div>
      </div>
    </article>
  )
}