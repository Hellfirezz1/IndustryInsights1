"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, updateUserNiches } from '@/lib/supabase'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Niche } from '@/types'

import { BarChart, Code, Coins, Copy, FileText, FlaskConical, Globe, HeartPulse, Leaf, DivideIcon, PenTool, ShieldCheck, ShoppingBag, Bluetooth as Tooth, Tv, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NicheCardProps {
  niche: Niche
  isSelected: boolean
  onToggle: (id: string) => void
  disabled: boolean
}

const nicheIcons: Record<string, React.ComponentType<{ size?: string | number }>> = {
  "ecommerce": ShoppingBag,
  "design": PenTool,
  "crypto": Coins,
  "technology": Code,
  "marketing": Copy,
  "finance": BarChart,
  "healthcare": HeartPulse,
  "legal": FileText,
  "science": FlaskConical,
  "sustainability": Leaf,
  "cybersecurity": ShieldCheck,
  "manufacturing": Wrench,
  "entertainment": Tv,
  "dentistry": Tooth,
  "international": Globe,
}

function NicheCard({ niche, isSelected, onToggle, disabled }: NicheCardProps) {
  const IconComponent = nicheIcons[niche.id.toLowerCase()] || FileText

  return (
    <Card 
      className={`border-2 transition-all cursor-pointer ${
        isSelected ? 'border-primary' : 'border-border hover:border-primary/20'
      }`}
      onClick={() => !disabled && onToggle(niche.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconComponent size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{niche.name}</h3>
              <Checkbox 
                checked={isSelected} 
                onCheckedChange={() => onToggle(niche.id)} 
                disabled={disabled && !isSelected}
              />
            </div>
            <p className="text-sm text-muted-foreground">{niche.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function NicheSelector() {
  const [selectedNiches, setSelectedNiches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const MAX_NICHES = 3
  
  // Mock data for niches - in a real app, this would come from the API
  const allNiches: Niche[] = [
    {
      id: "ecommerce",
      name: "E-commerce & Retail",
      description: "Latest trends in online and physical retail, consumer behavior, and logistics",
      icon: "ShoppingBag"
    },
    {
      id: "design",
      name: "Design & UX",
      description: "User experience trends, design systems, and creative innovations",
      icon: "PenTool"
    },
    {
      id: "crypto",
      name: "Crypto & Blockchain",
      description: "Cryptocurrency market updates, blockchain technology, and DeFi developments",
      icon: "Coins"
    },
    {
      id: "technology",
      name: "Software Development",
      description: "Programming languages, frameworks, best practices, and tech stacks",
      icon: "Code"
    },
    {
      id: "marketing",
      name: "Digital Marketing",
      description: "SEO, content marketing, social media strategies, and advertising trends",
      icon: "Copy"
    },
    {
      id: "finance",
      name: "Finance & Investing",
      description: "Market analysis, investment opportunities, and financial planning insights",
      icon: "BarChart"
    },
    {
      id: "healthcare",
      name: "Healthcare & Biotech",
      description: "Medical innovations, healthcare policy, and biotechnology advancements",
      icon: "HeartPulse"
    },
    {
      id: "legal",
      name: "Legal & Compliance",
      description: "Regulatory updates, legal trends, and compliance best practices",
      icon: "FileText"
    },
    {
      id: "dentistry",
      name: "Dentistry",
      description: "Latest in dental techniques, practice management, and industry regulations",
      icon: "Tooth"
    }
  ]
  
  useEffect(() => {
    const fetchUserNiches = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('niches')
          .eq('id', user.id)
          .single()
          
        if (data?.niches) {
          setSelectedNiches(data.niches)
        }
      }
    }
    
    fetchUserNiches()
  }, [])
  
  const handleToggleNiche = (nicheId: string) => {
    setSelectedNiches(prev => {
      if (prev.includes(nicheId)) {
        return prev.filter(id => id !== nicheId)
      } else {
        if (prev.length >= MAX_NICHES) return prev
        return [...prev, nicheId]
      }
    })
  }
  
  const handleSubmit = async () => {
    if (selectedNiches.length === 0) {
      toast.error('Please select at least one niche')
      return
    }
    
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      await updateUserNiches(user.id, selectedNiches)
      
      toast.success('Niches updated successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to save niche preferences')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Choose Your Industries</CardTitle>
          <CardDescription>
            Select up to {MAX_NICHES} niches to receive personalized content digests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-6">
            Selected: <span className="font-medium">{selectedNiches.length}/{MAX_NICHES}</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allNiches.map(niche => (
              <NicheCard 
                key={niche.id}
                niche={niche}
                isSelected={selectedNiches.includes(niche.id)}
                onToggle={handleToggleNiche}
                disabled={selectedNiches.length >= MAX_NICHES}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleSubmit} 
            disabled={isLoading || selectedNiches.length === 0}
          >
            {isLoading ? 'Saving...' : 'Save Preferences & Continue'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}