import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  BookOpen, 
  Clock, 
  Calendar,
  BarChart,
  Share2
} from "lucide-react"

export function DigestPreview() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What You'll Receive</h2>
          <p className="text-muted-foreground text-lg">
            Every 3 days, we deliver expertly curated content directly to your inbox and dashboard
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Comprehensive Summaries</h3>
                  <p className="text-muted-foreground">
                    Concise breakdowns of the most important developments in your industry
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Time-Saving Format</h3>
                  <p className="text-muted-foreground">
                    Designed to be read in under 10 minutes, perfect for busy professionals
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Regular Delivery</h3>
                  <p className="text-muted-foreground">
                    Predictable schedule every 3 days keeps you consistently informed
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <BarChart size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Data Visualization</h3>
                  <p className="text-muted-foreground">
                    Charts and graphs that help you understand complex trends at a glance
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Share2 size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Actionable Takeaways</h3>
                  <p className="text-muted-foreground">
                    Each digest ends with practical insights you can apply immediately
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <Card className="overflow-hidden border-2 shadow-lg">
              <CardContent className="p-0">
                <div className="p-6 border-b bg-muted/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">E-commerce Weekly Digest</h3>
                      <p className="text-sm text-muted-foreground">Issue #42 • June 18, 2025</p>
                    </div>
                    <Badge variant="secondary">Premium</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">In this digest:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Amazon's new fulfillment strategy</li>
                      <li>• The rise of social commerce in 2025</li>
                      <li>• Headless commerce adoption trends</li>
                      <li>• New EU regulations affecting online sellers</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Amazon Revamps Fulfillment Network</h4>
                    <p className="text-muted-foreground mb-3">
                      Amazon announced a complete overhaul of their fulfillment network, focusing on same-day delivery...
                    </p>
                    <div className="bg-muted/50 h-32 rounded-md flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">Chart: Amazon Delivery Times (2020-2025)</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">Social Commerce Boom Continues</h4>
                    <p className="text-muted-foreground">
                      TikTok Shop and Instagram Marketplace are rapidly gaining market share, with conversion rates exceeding traditional...
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-muted-foreground">5 min read</span>
                    <div className="flex gap-2">
                      {["E-commerce", "Retail", "Tech"].map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}