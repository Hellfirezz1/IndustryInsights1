import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Digest } from '@/types'

interface DigestCardProps {
  digest: Digest
}

export function DigestCard({ digest }: DigestCardProps) {
  const formattedDate = format(new Date(digest.date), 'MMMM d, yyyy')
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{digest.title}</CardTitle>
            <CardDescription className="flex items-center mt-2">
              <Calendar size={14} className="mr-1" />
              {formattedDate}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {digest.topics.slice(0, 2).map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
            {digest.topics.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{digest.topics.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-3">{digest.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock size={14} className="mr-1" />
          <span>5 min read</span>
        </div>
        <Button asChild>
          <Link href={`/digest/${digest.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}