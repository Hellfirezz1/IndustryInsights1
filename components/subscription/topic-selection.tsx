"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const AVAILABLE_TOPICS = [
  'Marketing',
  'AI & Machine Learning',
  'Startups',
  'Technology',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Design',
  'Product Management',
  'Data Science'
]

export function TopicSelection() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [customTopics, setCustomTopics] = useState<string[]>([])
  const [customTopicInput, setCustomTopicInput] = useState('')
  const router = useRouter()

  const handleTopicSelect = async (topic: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: userData } = await supabase
      .from('users')
      .select('selectedPlan')
      .eq('id', user.id)
      .single()

    const maxTopics = userData?.selectedPlan === 'pro' ? 3 : 1

    if (selectedTopics.includes(topic)) {
      setSelectedTopics(prev => prev.filter(t => t !== topic))
    } else if (selectedTopics.length < maxTopics) {
      setSelectedTopics(prev => [...prev, topic])
    } else {
      toast.error(`You can only select ${maxTopics} topic${maxTopics > 1 ? 's' : ''} with your plan`)
    }
  }

  const handleCustomTopicAdd = async () => {
    if (!customTopicInput.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: userData } = await supabase
      .from('users')
      .select('selectedPlan')
      .eq('id', user.id)
      .single()

    const maxTopics = userData?.selectedPlan === 'pro' ? 3 : 1
    const totalTopics = selectedTopics.length + customTopics.length

    if (totalTopics >= maxTopics) {
      toast.error(`You can only select ${maxTopics} topic${maxTopics > 1 ? 's' : ''} with your plan`)
      return
    }

    setCustomTopics(prev => [...prev, customTopicInput.trim()])
    setCustomTopicInput('')
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const allTopics = [...selectedTopics, ...customTopics]
      
      await supabase
        .from('users')
        .update({ 
          niches: allTopics,
          subscriptionStatus: 'active',
          trialStartDate: new Date().toISOString()
        })
        .eq('id', user.id)

      toast.success('Topics selected successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to save topics')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Select Your Topics</CardTitle>
          <CardDescription>
            Choose the topics you want to receive insights about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {AVAILABLE_TOPICS.map((topic) => (
              <Button
                key={topic}
                variant={selectedTopics.includes(topic) ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => handleTopicSelect(topic)}
              >
                {selectedTopics.includes(topic) && (
                  <Check className="mr-2 h-4 w-4" />
                )}
                {topic}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter custom topic"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomTopicAdd()}
              />
              <Button onClick={handleCustomTopicAdd}>Add</Button>
            </div>

            {customTopics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customTopics.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                  >
                    <span>{topic}</span>
                    <button
                      onClick={() => setCustomTopics(prev => prev.filter(t => t !== topic))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isLoading || (selectedTopics.length === 0 && customTopics.length === 0)}
          >
            {isLoading ? 'Saving...' : 'Continue to Dashboard'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 