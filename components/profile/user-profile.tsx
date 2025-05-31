"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, updateUserNiches } from '@/lib/supabase'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Calendar, CreditCard, User } from 'lucide-react'
import { User as UserType, Niche } from '@/types'

const MOCK_NICHES: Record<string, Niche> = {
  "ecommerce": {
    id: "ecommerce",
    name: "E-commerce & Retail",
    description: "Latest trends in online and physical retail",
    icon: "ShoppingBag"
  },
  "design": {
    id: "design",
    name: "Design & UX",
    description: "User experience trends and design systems",
    icon: "PenTool"
  },
  "crypto": {
    id: "crypto",
    name: "Crypto & Blockchain",
    description: "Cryptocurrency and blockchain technology",
    icon: "Coins"
  },
  "technology": {
    id: "technology",
    name: "Software Development",
    description: "Programming and software engineering",
    icon: "Code"
  },
  "marketing": {
    id: "marketing",
    name: "Digital Marketing",
    description: "Marketing strategies and trends",
    icon: "Copy"
  },
  "dentistry": {
    id: "dentistry",
    name: "Dentistry",
    description: "Dental techniques and industry updates",
    icon: "Tooth"
  }
}

export function UserProfile() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingNiches, setEditingNiches] = useState(false)
  const [selectedNiches, setSelectedNiches] = useState<string[]>([])
  const router = useRouter()
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          router.push('/auth')
          return
        }
        
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
          
        setUser(userData as UserType)
        setSelectedNiches(userData?.niches || [])
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [router])
  
  const handleNicheUpdate = async () => {
    if (!user) return
    
    try {
      await updateUserNiches(user.id, selectedNiches)
      
      setUser(prev => prev ? { ...prev, niches: selectedNiches } : null)
      setEditingNiches(false)
      
      toast.success('Your preferences have been updated')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to update preferences')
    }
  }
  
  const handleToggleNiche = (nicheId: string) => {
    setSelectedNiches(prev => {
      if (prev.includes(nicheId)) {
        return prev.filter(id => id !== nicheId)
      } else {
        if (prev.length >= 3) return prev
        return [...prev, nicheId]
      }
    })
  }
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
      toast.success('Signed out successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out')
    }
  }
  
  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              You need to be logged in to view this page
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>
            Manage your account settings and subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <User size={16} />
              <span>ACCOUNT</span>
            </div>
            <div className="rounded-lg border p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <CreditCard size={16} />
              <span>SUBSCRIPTION</span>
            </div>
            <div className="rounded-lg border p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <div className="flex items-center">
                    <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                      {user.subscriptionStatus === 'active' ? 'Active' : 
                       user.subscriptionStatus === 'trial' ? 'Trial' : 'Expired'}
                    </Badge>
                  </div>
                </div>
                
                {user.trialStartDate && user.subscriptionStatus === 'trial' && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Trial Ends</p>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Calendar size={14} />
                      <span>
                        {new Date(new Date(user.trialStartDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-1 md:col-start-3 md:text-right">
                  <Button variant="outline" asChild>
                    <a href="/subscribe">
                      {user.subscriptionStatus === 'active' ? 'Manage Subscription' : 'Subscribe Now'}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                </svg>
                <span>YOUR NICHES</span>
              </div>
              {!editingNiches && (
                <Button variant="ghost" size="sm" onClick={() => setEditingNiches(true)}>
                  Edit
                </Button>
              )}
            </div>
            
            <div className="rounded-lg border p-4">
              {editingNiches ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select up to 3 niches you're interested in.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.values(MOCK_NICHES).map(niche => (
                      <div 
                        key={niche.id} 
                        className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                          selectedNiches.includes(niche.id) 
                            ? 'bg-primary/10 border-primary' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleToggleNiche(niche.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{niche.name}</span>
                          <input 
                            type="checkbox" 
                            checked={selectedNiches.includes(niche.id)} 
                            onChange={() => {}}
                            disabled={selectedNiches.length >= 3 && !selectedNiches.includes(niche.id)}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setEditingNiches(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleNicheUpdate}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {user.niches && user.niches.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.niches.map(nicheId => (
                        <Badge key={nicheId} variant="secondary">
                          {MOCK_NICHES[nicheId]?.name || nicheId}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You haven't selected any niches yet. Click "Edit" to customize your content.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}