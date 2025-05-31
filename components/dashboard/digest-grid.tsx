"use client"

import { useEffect, useState } from 'react'
import { getDigests, supabase } from '@/lib/supabase'
import { Digest } from '@/types'
import { DigestCard } from './digest-card'
import { Skeleton } from '@/components/ui/skeleton'

export function DigestGrid() {
  const [digests, setDigests] = useState<Digest[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchDigests = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const data = await getDigests(user.id)
          setDigests(data || [])
        }
      } catch (error) {
        console.error("Error fetching digests:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDigests()
  }, [])
  
  // Mock data for demonstration
  const mockDigests: Digest[] = loading ? [] : digests.length > 0 ? digests : [
    {
      id: '1',
      userId: 'user123',
      title: 'E-commerce Trends: Q2 2025',
      date: '2025-06-15T12:00:00Z',
      summary: 'This week we explore the latest e-commerce trends, including the rise of voice commerce, new payment technologies, and sustainability practices in online retail.',
      content: 'Full content would go here...',
      topics: ['E-commerce', 'Technology', 'Retail']
    },
    {
      id: '2',
      userId: 'user123',
      title: 'Cryptocurrency Market Analysis',
      date: '2025-06-12T12:00:00Z',
      summary: 'Our analysis of the current cryptocurrency market, focusing on regulatory changes, institutional adoption, and emerging altcoins.',
      content: 'Full content would go here...',
      topics: ['Crypto', 'Finance', 'Technology']
    },
    {
      id: '3',
      userId: 'user123',
      title: 'UX Design: Mobile First in 2025',
      date: '2025-06-09T12:00:00Z',
      summary: 'Exploring how mobile-first design approaches are evolving in 2025, with case studies from leading brands.',
      content: 'Full content would go here...',
      topics: ['Design', 'UX', 'Mobile']
    },
    {
      id: '4',
      userId: 'user123',
      title: 'AI in Healthcare: Latest Developments',
      date: '2025-06-06T12:00:00Z',
      summary: 'How artificial intelligence is transforming healthcare delivery, diagnosis, and treatment planning.',
      content: 'Full content would go here...',
      topics: ['Healthcare', 'AI', 'Technology']
    },
    {
      id: '5',
      userId: 'user123',
      title: 'Sustainable Supply Chain Innovations',
      date: '2025-06-03T12:00:00Z',
      summary: 'New approaches to supply chain management focusing on sustainability, transparency, and efficiency.',
      content: 'Full content would go here...',
      topics: ['Sustainability', 'Logistics', 'Business']
    },
    {
      id: '6',
      userId: 'user123',
      title: 'Digital Marketing: Social Media in 2025',
      date: '2025-05-31T12:00:00Z',
      summary: 'How social media marketing is evolving, with analysis of new platforms, features, and consumer behavior.',
      content: 'Full content would go here...',
      topics: ['Marketing', 'Social Media', 'Digital']
    }
  ]
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardSkeleton />
          </Card>
        ))}
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockDigests.map((digest) => (
        <DigestCard key={digest.id} digest={digest} />
      ))}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {children}
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex justify-between pt-4">
        <Skeleton className="h-4 w-1/5" />
        <Skeleton className="h-9 w-1/4" />
      </div>
    </div>
  )
}