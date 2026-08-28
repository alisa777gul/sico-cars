'use client'

import { useMemo, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import {
  useCars, Navbar, Hero, Ticker, Services, Coverflow, WhyUs,
  Financing, Testimonials, Contact, Footer, CarDialog,
} from './parts'

export default function App() {
  const { cars } = useCars()
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const openCar = (car) => { setSelected(car); setOpen(true) }

  const featured = useMemo(() => {
    const f = cars.filter((c) => c.featured)
    return (f.length ? f : cars).slice(0, 7)
  }, [cars])
  const heroCar = featured[0] || cars[0]

  return (
    <main className="min-h-screen bg-[#0E1A14] text-[#EFEAD9] selection:bg-[#C4A667] selection:text-[#0E1A14]">
      <Navbar />
      <Hero heroCar={heroCar} onOpenCar={openCar} />
      <Ticker />
      <Services />
      <Coverflow cars={featured} onOpenCar={openCar} />
      <WhyUs />
      <Financing />
      <Testimonials />
      <Contact />
      <Footer />
      <CarDialog car={selected} open={open} onOpenChange={setOpen} />
      <Toaster position="top-center" theme="light" richColors />
    </main>
  )
}
