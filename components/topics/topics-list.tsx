"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const topics = [
  {
    category: "Technology",
    topics: [
      { id: "ai-ml", name: "AI & Machine Learning", description: "Latest in artificial intelligence and machine learning applications" },
      { id: "blockchain", name: "Blockchain & Web3", description: "Cryptocurrency, DeFi, and blockchain technology developments" },
      { id: "cloud", name: "Cloud Computing", description: "Cloud platforms, serverless, and infrastructure trends" },
      { id: "cybersecurity", name: "Cybersecurity", description: "Security threats, protection strategies, and industry standards" }
    ]
  },
  {
    category: "Business",
    topics: [
      { id: "ecommerce", name: "E-commerce", description: "Online retail trends, platforms, and strategies" },
      { id: "fintech", name: "Fintech", description: "Financial technology innovations and digital banking" },
      { id: "marketing", name: "Digital Marketing", description: "Marketing strategies, SEO, and social media" },
      { id: "startup", name: "Startups & Innovation", description: "Startup ecosystem, funding, and entrepreneurship" }
    ]
  },
  {
    category: "Healthcare",
    topics: [
      { id: "biotech", name: "Biotech", description: "Biotechnology advances and research breakthroughs" },
      { id: "digital-health", name: "Digital Health", description: "Telemedicine, health tech, and patient care innovation" },
      { id: "pharma", name: "Pharmaceuticals", description: "Drug development, research, and industry trends" }
    ]
  },
  {
    category: "Creative",
    topics: [
      { id: "design", name: "Design & UX", description: "User experience, interface design, and creative tools" },
      { id: "gaming", name: "Gaming Industry", description: "Video game development, platforms, and market trends" },
      { id: "media", name: "Digital Media", description: "Streaming, content creation, and entertainment tech" }
    ]
  },
  {
    category: "Sustainability",
    topics: [
      { id: "clean-tech", name: "Clean Technology", description: "Renewable energy and sustainable tech solutions" },
      { id: "green-business", name: "Green Business", description: "Sustainable business practices and ESG initiatives" }
    ]
  }
]

export function TopicsList() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredTopics = topics.map(category => ({
    ...category,
    topics: category.topics.filter(topic =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.topics.length > 0)
  
  return (
    <div className="container px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-16">
          {filteredTopics.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-8">{category.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {category.topics.map((topic) => (
                  <Card key={topic.id} className="transition-all hover:shadow-md">
                    <CardHeader className="text-left">
                      <CardTitle className="text-xl">{topic.name}</CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
          
          {filteredTopics.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No topics found matching your search.</p>
            </div>
          )}
        </div>
        
        <div className="mt-20 max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <CardTitle className="mb-4">Ready to get started?</CardTitle>
            <CardDescription className="mb-6">
              Choose your plan and start receiving curated insights from your preferred topics.
            </CardDescription>
            <Button asChild size="lg">
              <Link href="/auth">Start Free Trial</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}