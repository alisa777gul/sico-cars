'use client'

import { Toaster } from '@/components/ui/sonner'
import { useCars, Navbar, Inventory, Ticker, Contact, Footer } from '../parts'

export default function PonukaPage() {
  const { cars, loading } = useCars()

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0E1A14] text-[#EFEAD9] selection:bg-[#C4A667] selection:text-[#0E1A14]">
      <Navbar />

      <header className="pt-28 md:pt-32 pb-8 md:pb-10 border-b border-[#EFEAD9]/12">
        <div className="container mx-auto px-5 md:px-8 lg:px-12">
          <a href="/" className="text-[11px] uppercase tracking-[0.25em] text-[#8C948A] hover:text-[#C4A667] transition">← Späť na úvod</a>
          <div className="mt-5 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <span className="text-[11px] uppercase tracking-[0.35em] text-[#C4A667]"><span className="text-[#EFEAD9]/30 mr-3">01</span>Kompletná ponuka</span>
              <h1 className="mt-4 font-display text-5xl md:text-8xl leading-[0.95]">Ponuka <span className="italic text-[#C4A667]">vozidiel</span></h1>
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
        <Inventory cars={cars} showHeader={false} />
      )}

      <Ticker />
      <Contact />
      <Footer />
      <Toaster position="top-center" theme="dark" richColors />
    </main>
  )
}
