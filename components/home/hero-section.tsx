"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Curated Insights, Delivered Regularly
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Stay Ahead with <span className="text-primary">Industry Insights</span> That Matter
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Receive expertly curated content from your chosen industries, delivered directly to your inbox every 3 days. Save time and stay informed with IndustryDigest.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button asChild size="lg" className="px-8">
                <Link href="/auth">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#pricing">View Pricing</Link>
              </Button>
            </motion.div>
            
            <motion.div
              className="pt-4 text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              No credit card required for 7-day trial. Cancel anytime.
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="relative bg-gradient-to-br from-muted/50 to-muted p-1 rounded-lg shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg"></div>
              <div className="relative bg-card rounded-md p-6 shadow-sm overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                      <h3 className="font-medium">Weekly Crypto Digest</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">June 15, 2025</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-6 bg-muted/70 rounded w-full"></div>
                    <div className="h-6 bg-muted/70 rounded w-5/6"></div>
                    <div className="h-6 bg-muted/70 rounded w-4/6"></div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Bitcoin</span>
                      <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground rounded-full text-xs">Ethereum</span>
                      <span className="px-2 py-1 bg-muted rounded-full text-xs">DeFi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}