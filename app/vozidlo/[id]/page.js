'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { ArrowLeft, Phone, Share2, Check, Play } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  useCars, Navbar, Footer, CarCard, media, eur, priceLabel, kmLabel,
  monthlyFrom, FUEL_LABEL, ytEmbed, COMPANY,
} from '../../parts'

const btnGold = 'inline-flex items-center justify-center gap-2 bg-[#C4A667] text-[#0E1A14] px-6 py-3.5 text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-[#EAD9AE] transition rounded-full'
const btnOutline = 'inline-flex items-center justify-center gap-2 border border-[#C4A667]/50 text-[#C4A667] px-6 py-3.5 text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-[#C4A667] hover:text-[#0E1A14] transition rounded-full'
const inputCls = 'rounded-none border-[#EFEAD9]/20 bg-transparent text-[#EFEAD9] placeholder:text-[#5f665d] focus-visible:ring-[#C4A667]'

export default function VozidloPage() {
  const { id } = useParams()
  const { cars, loading } = useCars()
  const car = useMemo(() => cars.find((c) => c.id === id), [cars, id])
  const related = useMemo(
    () => (car ? cars.filter((c) => c.id !== car.id && (c.brand === car.brand || c.fuel === car.fuel)).slice(0, 3) : []),
    [cars, car]
  )
  const [idx, setIdx] = useState(0)
  const [video, setVideo] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [sent, setSent] = useState(false)

  const images = car ? [car.image, car.image2].filter(Boolean) : []
  const embed = car ? ytEmbed(car.youtube) : null

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast.success('Odkaz skopírovaný do schránky') }
    catch { toast.error('Nepodarilo sa skopírovať') }
  }
  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || (!form.phone && !form.email)) { toast.error('Meno a kontakt sú povinné.'); return }
    try {
      const res = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, type: 'car', carId: car.id, carName: `${car.brand} ${car.name}` }) })
      if (!res.ok) throw new Error()
      setSent(true); toast.success('Dopyt odoslaný! Ozveme sa vám.')
    } catch { toast.error('Niečo sa pokazilo.') }
  }

  const specs = car ? [
    { label: 'Rok', value: car.year },
    { label: 'Najazdené', value: kmLabel(car.mileage) },
    { label: 'Výkon', value: `${car.power} kW` },
    { label: 'Palivo', value: FUEL_LABEL[car.fuel] },
    { label: 'Prevodovka', value: car.transmission },
    { label: 'Karoséria', value: car.body },
  ] : []

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0E1A14] text-[#EFEAD9] selection:bg-[#C4A667] selection:text-[#0E1A14]">
      <Navbar />
      <div className="container mx-auto px-5 md:px-8 lg:px-12 pt-28 md:pt-32 pb-16">
        <a href="/ponuka" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#8C948A] hover:text-[#C4A667] transition"><ArrowLeft className="h-4 w-4" />Späť na ponuku</a>

        {loading ? (
          <div className="py-24 text-center text-[#8C948A]">Načítavam…</div>
        ) : !car ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl">Vozidlo sa nenašlo</p>
            <a href="/ponuka" className="mt-4 inline-block text-[#C4A667]">Zobraziť ponuku</a>
          </div>
        ) : (
          <>
            <div className="mt-6 grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
              {/* gallery */}
              <div>
                <div className="relative border border-[#C4A667]/30 bg-[#13211A]">
                  {video && embed ? (
                    <div className="relative w-full aspect-video">
                      <iframe src={embed + '?autoplay=1'} title="Video" className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                    </div>
                  ) : (
                    <img src={media(images[idx] || car.image, 1000, 660)} alt={car.name} className="w-full h-[260px] sm:h-[400px] lg:h-[460px] object-cover" />
                  )}
                  <div className="absolute left-4 top-4 border border-[#C4A667]/60 bg-[#0E1A14]/70 text-[#C4A667] text-[10px] uppercase tracking-[0.2em] px-3 py-1">{FUEL_LABEL[car.fuel]}</div>
                </div>
                <div className="mt-3 flex gap-3 flex-wrap">
                  {images.map((im, i) => (
                    <button key={i} onClick={() => { setVideo(false); setIdx(i) }} className={`h-16 w-24 sm:h-20 sm:w-28 overflow-hidden border ${!video && idx === i ? 'border-[#C4A667]' : 'border-[#EFEAD9]/15'}`}>
                      <img src={media(im, 220, 150)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {embed && (
                    <button onClick={() => setVideo(true)} className={`h-16 w-24 sm:h-20 sm:w-28 grid place-items-center border ${video ? 'border-[#C4A667] text-[#C4A667]' : 'border-[#EFEAD9]/15 text-[#EFEAD9]/70'}`}>
                      <Play className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* info */}
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#8C948A]">{car.brand} · {car.year}</div>
                <h1 className="mt-2 font-display text-4xl sm:text-5xl leading-tight">{car.name}</h1>
                <div className="mt-4 flex items-end gap-4 flex-wrap">
                  <div className="font-display text-4xl text-[#C4A667]">{priceLabel(car)}{car.dph ? ' s DPH' : ''}</div>
                  {monthlyFrom(car.price) && <div className="text-[11px] uppercase tracking-[0.2em] text-[#8C948A] pb-1.5">od {eur(monthlyFrom(car.price))} €/mes · 72 mes.</div>}
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 border-t border-l border-[#EFEAD9]/12">
                  {specs.map((s) => (
                    <div key={s.label} className="border-b border-r border-[#EFEAD9]/12 p-4">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#8C948A]">{s.label}</div>
                      <div className="mt-1.5 font-display text-base">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={`tel:${COMPANY.phoneHref}`} className={btnGold}><Phone className="h-4 w-4" /> Zavolať</a>
                  <button onClick={share} className={btnOutline}><Share2 className="h-4 w-4" /> Zdieľať</button>
                </div>

                <div className="mt-8 border border-[#C4A667]/30 bg-[#13211A] p-6 sm:p-7">
                  {sent ? (
                    <div className="text-center py-4">
                      <span className="grid place-items-center h-12 w-12 mx-auto border border-[#C4A667]/50 text-[#C4A667] rounded-full"><Check className="h-6 w-6" /></span>
                      <p className="mt-3 font-display text-2xl">Ďakujeme za dopyt!</p>
                      <p className="text-sm text-[#8C948A]">Ozveme sa vám čo najskôr.</p>
                    </div>
                  ) : (
                    <form onSubmit={submit}>
                      <div className="text-[11px] uppercase tracking-[0.25em] text-[#8C948A] mb-4">Mám záujem o toto vozidlo</div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <Input placeholder="Meno *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
                        <Input placeholder="Telefón" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} />
                        <Input placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
                      </div>
                      <button type="submit" className={btnGold + ' mt-4 w-full !py-3.5'}>Odoslať dopyt</button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-16 border-t border-[#EFEAD9]/12 pt-10">
                <span className="text-[11px] uppercase tracking-[0.35em] text-[#C4A667]">Podobné vozidlá</span>
                <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((c) => <CarCard key={c.id} car={c} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
      <Toaster position="top-center" theme="dark" richColors />
    </main>
  )
}
