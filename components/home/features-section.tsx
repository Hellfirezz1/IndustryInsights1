import { 
  Newspaper, 
  Clock, 
  Filter, 
  PieChart, 
  Target, 
  TrendingUp 
} from "lucide-react"

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="p-6 rounded-lg border bg-card transition-all hover:shadow-md">
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: <Newspaper size={24} />,
      title: "Expert Curation",
      description: "Content curated by industry experts who understand what matters in your field."
    },
    {
      icon: <Clock size={24} />,
      title: "Save Time",
      description: "Stop wasting hours sifting through content. Get only what's relevant, every 3 days."
    },
    {
      icon: <Filter size={24} />,
      title: "Personalized Feed",
      description: "Choose up to 3 niches that matter to you. Content tailored to your interests."
    },
    {
      icon: <PieChart size={24} />,
      title: "Data-Driven",
      description: "Insights backed by data and analysis from trusted industry sources."
    },
    {
      icon: <Target size={24} />,
      title: "Stay Focused",
      description: "Cut through the noise and focus only on developments that impact your work."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Ahead of Trends",
      description: "Identify emerging trends before they become mainstream in your industry."
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose IndustryDigest</h2>
          <p className="text-muted-foreground text-lg">
            We help professionals stay informed without the information overload
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}