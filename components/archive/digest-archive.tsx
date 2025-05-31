"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { Digest } from '@/types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DigestCard } from '@/components/dashboard/digest-card'
import { Calendar, Search } from 'lucide-react'

export function DigestArchive() {
  const [digests, setDigests] = useState<Digest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('all')
  const router = useRouter()
  
  useEffect(() => {
    const fetchUserDigests = async () => {
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
        
        // Fetch only the authenticated user's digests
        const { data: userDigests, error } = await supabase
          .from('digests')
          .select('*')
          .eq('userId', session.user.id)
          .order('date', { ascending: false })
        
        if (error) throw error
        setDigests(userDigests || [])
      } catch (error) {
        console.error('Error fetching digests:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserDigests()
  }, [router])
  
  const allTopics = Array.from(
    new Set(digests.flatMap(digest => digest.topics))
  ).sort()
  
  const filteredDigests = digests.filter(digest => {
    const matchesSearch = digest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         digest.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = selectedTopic === 'all' || digest.topics.includes(selectedTopic)
    return matchesSearch && matchesTopic
  })
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your digests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        {allTopics.length > 0 && (
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {allTopics.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      {filteredDigests.length > 0 ? (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {filteredDigests.length} digest{filteredDigests.length !== 1 ? 's' : ''}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDigests.map((digest) => (
              <DigestCard key={digest.id} digest={digest} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No digests found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}