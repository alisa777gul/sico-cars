'use client'

import { useMemo } from 'react'
import { Toaster } from '@/components/ui/sonner'
import {
  useCars, Navbar, Hero, Ticker, Services, Coverflow, WhyUs,
  Financing, Testimonials, Contact, Footer,
} from './parts'

export default function App() {
  const { cars } = useCars()
  const featured = useMemo(() => {
    const f = cars.filter((c) => c.featured)
    return (f.length ? f : cars).slice(0, 7)
  }, [cars])
  const heroCar = featured[0] || cars[0]

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0E1A14] text-[#EFEAD9] selection:bg-[#C4A667] selection:text-[#0E1A14]">
      <Navbar />
      <Hero heroCar={heroCar} />
      <Ticker />
      <Services />
      <Coverflow cars={featured} />
      <WhyUs />
      <Financing />
      <Testimonials />
      <Contact />
      <Footer />
      <Toaster position="top-center" theme="dark" richColors />
    </main>
  )
}
