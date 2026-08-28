'use client'

import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { ArrowRight } from 'lucide-react'
import { useCars, Navbar, Inventory, Ticker, Contact, Footer, CarDialog } from '../parts'

export default function PonukaPage() {
  const { cars, loading } = useCars()
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const openCar = (car) => { setSelected(car); setOpen(true) }

  return (
    <main className="min-h-screen bg-[#EDE9E0] text-[#141310] selection:bg-[#FF3B00] selection:text-white">
      <Navbar />

      {/* page header */}
      <header className="pt-32 pb-10 border-b border-[#141310]/12">
        <div className="container mx-auto px-5 md:px-8 lg:px-12">
          <a href="/" className="font-mono2 text-xs uppercase tracking-widest text-[#6B675E] hover:text-[#FF3B00]">← Späť na úvod</a>
          <div className="mt-4 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <span className="font-mono2 text-xs uppercase tracking-widest text-[#FF3B00]">01 / Kompletná ponuka</span>
              <h1 className="mt-3 font-display uppercase text-6xl md:text-8xl leading-[0.9]">Ponuka<br />vozidiel</h1>
            </div>
            <div className="font-mono2 text-sm text-[#6B675E]">
              {loading ? '…' : `${cars.length}`} <span className="uppercase">vozidiel skladom</span>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="py-24 text-center font-mono2 text-[#6B675E]">Načítavam vozidlá…</div>
      ) : (
        <Inventory cars={cars} onOpenCar={openCar} showHeader={false} />
      )}

      <Ticker />
      <Contact />
      <Footer />
      <CarDialog car={selected} open={open} onOpenChange={setOpen} />
      <Toaster position="top-center" theme="light" richColors />
    </main>
  )
}
