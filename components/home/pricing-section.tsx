"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "199",
      description: "Perfect for focused learning in one industry",
      features: [
        "Weekly curated digest",
        <span key="niche">Choose 1 niche from <Link href="/topics" className="text-blue-500 underline hover:text-blue-700">available topics</Link></span>,
        "Email delivery",
        "Basic support",
        "Access to digest archive"
      ]
    },
    {
      name: "Pro",
      price: "349",
      description: "For professionals tracking multiple industries",
      features: [
        "Digest every 3 days",
        "Choose up to 3 niches",
        "Email + Telegram delivery",
        "Custom topic requests",
        "Early access to beta features",
        "Priority support",
        "Access to digest archive"
      ],
      popular: true
    }
  ]
  
  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start with a 7-day free trial. Credit card required.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className={`relative border-2 ${plan.popular ? 'border-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="flex justify-center items-baseline mb-6">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="mr-3 text-primary">
                          <Check size={18} />
                        </div>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button asChild className="w-full" size="lg" variant={plan.popular ? "default" : "outline"}>
                    <Link href="/auth">Start 7-Day Free Trial</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/topics" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            View all available topics →
          </Link>
        </div>
      </div>
    </section>
  )
}