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
    <main className="min-h-screen bg-[#0E1A14] text-[#EFEAD9] selection:bg-[#C4A667] selection:text-[#0E1A14]">
      <Navbar />

      {/* page header */}
      <header className="pt-32 pb-10 border-b border-[#EFEAD9]/12">
        <div className="container mx-auto px-5 md:px-8 lg:px-12">
          <a href="/" className="text-[11px] uppercase tracking-[0.25em] text-[#8C948A] hover:text-[#C4A667] transition">← Späť na úvod</a>
          <div className="mt-5 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <span className="text-[11px] uppercase tracking-[0.35em] text-[#C4A667]"><span className="text-[#EFEAD9]/30 mr-3">01</span>Kompletná ponuka</span>
              <h1 className="mt-4 font-display text-6xl md:text-8xl leading-[0.95]">Ponuka <span className="italic text-[#C4A667]">vozidiel</span></h1>
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#8C948A]">
              {loading ? '…' : `${cars.length}`} vozidiel skladom
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="py-24 text-center text-[#8C948A]">Načítavam vozidlá…</div>
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
