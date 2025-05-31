"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { supabase } from '@/lib/supabase'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    
    checkAuth()
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })
    
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const closeMenu = () => setIsMenuOpen(false)
  
  const navLinks = [
    { href: '/', label: 'Home' },
    ...(isLoggedIn 
      ? [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/profile', label: 'Profile' }
        ] 
      : [])
  ]
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">IndustryDigest</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          
          {!isLoggedIn ? (
            <Button asChild variant="default">
              <Link href="/auth">Get Started</Link>
            </Button>
          ) : (
            <Button 
              variant="ghost"
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = '/'
              }}
            >
              Sign Out
            </Button>
          )}
          
          <ThemeToggle />
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background md:hidden">
          <nav className="container mx-auto px-4 py-8 flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {!isLoggedIn ? (
              <Button asChild variant="default" size="lg" className="w-full">
                <Link href="/auth" onClick={closeMenu}>Get Started</Link>
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full"
                onClick={async () => {
                  await supabase.auth.signOut()
                  closeMenu()
                  window.location.href = '/'
                }}
              >
                Sign Out
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}