"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="max-w-3xl mx-auto text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Stay Ahead in Your Industry?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals who rely on IndustryDigest for curated industry insights.
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="px-8">
              <Link href="/auth">Start Your Free Trial</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            7-day free trial, then only ₹199/month. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}