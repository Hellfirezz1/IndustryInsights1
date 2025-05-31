'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Digest {
  id: string
  topic: string
  content: string
  created_at: string
  status: 'pending' | 'sent' | 'failed'
}

export function DigestList() {
  const [digests, setDigests] = useState<Digest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDigests() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('Not authenticated')
          return
        }

        const { data, error } = await supabase
          .from('digests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setDigests(data || [])
      } catch (err) {
        console.error('Error fetching digests:', err)
        setError('Failed to load digests')
      } finally {
        setLoading(false)
      }
    }

    fetchDigests()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (digests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No digests available yet. They will appear here once generated.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {digests.map((digest) => (
        <Card key={digest.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {digest.topic} Digest
              <span className="ml-2 text-sm text-muted-foreground">
                {new Date(digest.created_at).toLocaleDateString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: digest.content }} />
            {digest.status === 'failed' && (
              <p className="text-sm text-red-500 mt-2">
                Failed to send email. Please try again later.
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 