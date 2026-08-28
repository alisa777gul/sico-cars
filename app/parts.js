'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car, Gauge, Fuel, Calendar, Cog, ArrowRight, ChevronLeft, ChevronRight,
  Phone, Mail, MapPin, Clock, Menu, X, Youtube, Navigation, BadgeCheck, Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

/* ---------- company ---------- */
export const COMPANY = {
  name: 'Motor-Centrum SICO Cars',
  street: 'Voľa 116',
  zip: '072 21',
  country: 'Slovenská Republika',
  phone: '+421 948 484 177',
  phoneHref: '+421948484177',
  emails: ['info@sicocars.sk', 'obchod@sicocars.sk'],
}
const MAP_QUERY = encodeURIComponent('Voľa 116, 072 21, Slovensko')
export const MAP_EMBED = `https://maps.google.com/maps?q=${MAP_QUERY}&z=13&output=embed`
export const MAP_DIR = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`

/* ---------- helpers ---------- */
export const media = (id, w = 900, h = 600) =>
  `https://static.wixstatic.com/media/${id}/v1/fill/w_${w},h_${h},al_c,q_90,enc_avif,quality_auto/img.jpg`
export const eur = (n) => new Intl.NumberFormat('sk-SK').format(n)
export const priceLabel = (c) => (c.price ? `${eur(c.price)} €` : 'Cena na dopyt')
export const kmLabel = (n) => `${eur(n)} km`
export const FUEL_LABEL = { diesel: 'Diesel', 'benzín': 'Benzín', elektro: 'Elektro', hybrid: 'Hybrid' }
const ACCENT = '#FF3B00'

/* ---------- data hook ---------- */
export function useCars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/cars').then((r) => r.json())
      .then((d) => setCars(Array.isArray(d) ? d : []))
      .catch(() => setCars([]))
      .finally(() => setLoading(false))
  }, [])
  return { cars, loading }
}

/* ---------- Tilt ---------- */
export function Tilt({ children, className = '', max = 8, scale = 1.0 }) {
  const ref = useRef(null)
  const [t, setT] = useState({ rx: 0, ry: 0, s: 1 })
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setT({ rx: -py * max, ry: px * max, s: scale })
  }
  const reset = () => setT({ rx: 0, ry: 0, s: 1 })
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={`perspective-1000 ${className}`}>
      <div className="preserve-3d transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.s})` }}>
        {children}
      </div>
    </div>
  )
}

/* ---------- small bits ---------- */
export function Label({ n, children }) {
  return (
    <span className="font-mono2 text-xs uppercase tracking-[0.2em] text-[#FF3B00]">
      {n && <span className="text-[#141310]/40 mr-2">{n}</span>}{children}
    </span>
  )
}

/* ---------- content ---------- */
const SERVICES = [
  { n: '01', title: 'Predaj a výkup áut', desc: 'Vykúpime vaše vozidlo za férovú cenu — rýchlo a bez starostí.' },
  { n: '02', title: 'Individuálny dovoz', desc: 'Dovezieme presne to auto, ktoré chcete, aj na objednávku zo zahraničia.' },
  { n: '03', title: 'Komisionálny predaj', desc: 'Predáme vaše auto za vás — postaráme sa o celý proces.' },
  { n: '04', title: 'Financovanie a leasing', desc: 'Schválenie úveru už do 2 hodín. Leasing na mieru.' },
  { n: '05', title: 'Poistenie vozidiel', desc: 'PZP aj havarijné poistenie vybavíme priamo na mieste.' },
  { n: '06', title: 'Profesionálny Chip-Tuning', desc: 'Zvýšenie výkonu a optimalizácia motora od profesionálov.' },
]
const WHY = ['Certifikované vozidlá', 'Overené kilometre', 'Individuálny dovoz', 'Testovacia jazda', 'Servisná história']
const TESTIMONIALS = [
  { name: 'Majky', text: 'Spokojnosť s autom, autobazárom a tiež s predajcom. Auto bolo pripravené vo výbornom stave, čisté na okamžité jazdenie. Predajca je seriózny človek.' },
  { name: 'Silvia', text: 'Maximálna spokojnosť.. od prvého kontaktu s predávajúcim.. až po kúpu vozidla.. milý príjemný komunikatívny pán... kúpené už tretie vozidlo u tohto pána.' },
  { name: 'Lukáš', text: 'Najlepší predajca áut široko ďaleko.. Profesionálny prístup, ochota pomôcť, výber kvalitných jazdených áut. Určite odporúčam!' },
]
const TICKER = ['Predaj', 'Výkup', 'Individuálny dovoz', 'Komisionálny predaj', 'Leasing', 'Poistenie', 'Chip-Tuning']
const BRANDS = ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Škoda', 'Hyundai', 'KIA', 'Toyota', 'Ford', 'Opel', 'Nissan', 'Peugeot']

/* ================= NAVBAR ================= */
export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const links = [
    { label: 'Vozidlá', href: '/ponuka' },
    { label: 'Služby', href: '/#sluzby' },
    { label: 'Financovanie', href: '/#financovanie' },
    { label: 'Referencie', href: '/#referencie' },
    { label: 'Kontakt', href: '/#kontakt' },
  ]
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[#EDE9E0]/95 backdrop-blur border-b border-[#141310]/12' : 'border-b border-transparent'}`}>
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3">
            <span className="grid place-items-center h-9 w-9 bg-[#141310] text-[#EDE9E0] font-display text-xl leading-none pt-1">S</span>
            <div className="leading-none">
              <div className="font-display text-xl uppercase tracking-tight">SICO<span className="text-[#FF3B00]">CARS</span></div>
              <div className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-[#6B675E]">rozumieme autám</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="font-mono2 text-xs uppercase tracking-widest text-[#141310] hover:text-[#FF3B00] transition">{l.label}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-5">
            <a href="tel:+421948484177" className="font-mono2 text-xs uppercase tracking-widest hover:text-[#FF3B00] transition">+421 948 484 177</a>
            <a href="/#kontakt" className="inline-flex items-center gap-2 bg-[#141310] text-[#EDE9E0] px-5 py-2.5 font-mono2 text-xs uppercase tracking-widest hover:bg-[#FF3B00] hover:text-white transition rounded-full">
              Mám záujem
            </a>
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#EDE9E0] border-b border-[#141310]/12 overflow-hidden">
            <div className="container mx-auto px-5 md:px-8 lg:px-12 py-3 flex flex-col">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 font-mono2 text-sm uppercase tracking-widest border-b border-[#141310]/8 last:border-0">{l.label}</a>
              ))}
              <a href="/#kontakt" onClick={() => setOpen(false)} className="mt-3 text-center bg-[#141310] text-[#EDE9E0] px-5 py-3 font-mono2 text-xs uppercase tracking-widest rounded-full">Mám záujem</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ================= TICKER ================= */
export function Ticker() {
  const row = [...TICKER, ...TICKER, ...TICKER, ...TICKER]
  return (
    <div className="ink py-3 overflow-hidden border-y border-[#141310]">
      <div className="flex w-max animate-marquee-fast items-center">
        {row.map((t, i) => (
          <span key={i} className="flex items-center font-display uppercase text-lg tracking-wide whitespace-nowrap">
            <span className="mx-6">{t}</span>
            <span className="text-[#FF3B00] text-xl leading-none">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ================= HERO ================= */
export function Hero({ heroCar, onOpenCar }) {
  return (
    <section id="top" className="relative pt-28 md:pt-32 pb-10 overflow-hidden">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          {/* headline */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="font-mono2 text-xs uppercase tracking-[0.2em] text-[#FF3B00] whitespace-nowrap">Autobazár novej generácie</span>
              <span className="h-px flex-1 bg-[#141310]/20" />
            </div>
            <h1 className="mt-6 font-display uppercase leading-[0.84] tracking-tight text-6xl sm:text-7xl lg:text-8xl xl:text-[8.75rem]">
              Rozumieme<br /><span className="text-outline-accent">autám</span>
            </h1>
            <p className="mt-6 max-w-lg text-[#3a382f] text-lg">
              Certifikované jazdené vozidlá s overenými kilometrami, individuálny dovoz na mieru
              a financovanie so schválením už <span className="font-semibold text-[#141310]">do 2 hodín</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/ponuka" className="inline-flex items-center gap-2 bg-[#141310] text-[#EDE9E0] px-6 py-3.5 font-mono2 text-xs uppercase tracking-widest hover:bg-[#FF3B00] hover:text-white transition rounded-full">
                Prehliadať ponuku <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/#kontakt" className="inline-flex items-center gap-2 border border-[#141310] px-6 py-3.5 font-mono2 text-xs uppercase tracking-widest hover:bg-[#141310] hover:text-[#EDE9E0] transition rounded-full">
                Vykúpime vaše auto
              </a>
            </div>
          </div>

          {/* featured car */}
          {heroCar && (
            <div className="lg:col-span-5">
              <Tilt max={9}>
                <div className="relative border border-[#141310] bg-[#FBFAF6]">
                  <div className="relative overflow-hidden">
                    <img src={media(heroCar.image, 800, 560)} alt={`${heroCar.brand} ${heroCar.name}`} className="w-full h-[300px] md:h-[360px] object-cover" />
                    <div className="absolute right-4 top-4 rotate-[-3deg] bg-[#FF3B00] text-white font-display uppercase text-lg md:text-xl px-3.5 py-1.5 shadow-lg">
                      {priceLabel(heroCar)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#141310] px-4 py-3">
                    <div className="min-w-0">
                      <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#6B675E]">{heroCar.brand} · {heroCar.year}</div>
                      <div className="font-display uppercase text-lg truncate">{heroCar.name}</div>
                    </div>
                    <button onClick={() => onOpenCar(heroCar)} className="shrink-0 grid place-items-center h-10 w-10 bg-[#141310] text-[#EDE9E0] hover:bg-[#FF3B00] transition rounded-full">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Tilt>
              <div className="mt-4 grid grid-cols-3 divide-x divide-[#141310]/15 border border-[#141310]/15">
                {[['30+', 'skladom'], ['2 h', 'schválenie'], ['100%', 'overené km']].map(([a, b]) => (
                  <div key={b} className="px-3 py-3 text-center">
                    <div className="font-display text-2xl">{a}</div>
                    <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#6B675E]">{b}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* brand row */}
        <div className="mt-12 border-t border-[#141310]/15 pt-5 overflow-hidden">
          <div className="flex w-max animate-marquee gap-10 items-center">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="font-display uppercase text-2xl text-[#141310]/25 whitespace-nowrap">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================= SERVICES ================= */
export function Services() {
  return (
    <section id="sluzby" className="py-16 scroll-mt-16 border-t border-[#141310]/12">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <Label n="02 /">Naše služby</Label>
            <h2 className="mt-3 font-display uppercase text-5xl md:text-7xl leading-[0.9]">Všetko<br />pod strechou</h2>
          </div>
          <p className="max-w-sm text-[#3a382f]">Od výkupu a dovozu, cez financovanie až po chip-tuning — vybavíme za vás všetko na jednom mieste.</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#141310]/15">
          {SERVICES.map((s) => (
            <div key={s.n} className="group relative border-b border-r border-[#141310]/15 p-7 transition-colors hover:bg-[#141310] hover:text-[#EDE9E0]">
              <div className="flex items-start justify-between">
                <span className="font-mono2 text-sm text-[#FF3B00]">{s.n}</span>
                <ArrowRight className="h-5 w-5 -rotate-45 opacity-30 group-hover:opacity-100 group-hover:rotate-0 transition" />
              </div>
              <h3 className="mt-8 font-display uppercase text-2xl leading-tight">{s.title}</h3>
              <p className="mt-3 text-sm text-[#6B675E] group-hover:text-[#EDE9E0]/70 transition-colors">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= COVERFLOW ================= */
export function Coverflow({ cars, onOpenCar }) {
  const [active, setActive] = useState(0)
  const n = cars.length
  const go = (d) => setActive((a) => (a + d + n) % n)
  useEffect(() => {
    if (n === 0) return
    const t = setInterval(() => setActive((a) => (a + 1) % n), 5000)
    return () => clearInterval(t)
  }, [n])
  if (n === 0) return null
  return (
    <section className="py-16 border-t border-[#141310]/12 overflow-hidden">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="text-center">
          <Label n="03 /">Vybrané vozidlá</Label>
          <h2 className="mt-3 font-display uppercase text-5xl md:text-7xl">Showroom v 3D</h2>
        </div>
        <div className="relative mt-10 h-[400px] md:h-[440px] perspective-2000 preserve-3d">
          {cars.map((car, i) => {
            let off = i - active
            if (off > n / 2) off -= n
            if (off < -n / 2) off += n
            const abs = Math.abs(off)
            const isActive = off === 0
            const style = {
              transform: `translateX(${off * 230}px) translateZ(${-abs * 240}px) rotateY(${off * -30}deg)`,
              zIndex: 100 - abs, opacity: abs > 2 ? 0 : 1, pointerEvents: abs > 2 ? 'none' : 'auto',
            }
            return (
              <div key={car.id} className="absolute inset-0 mx-auto w-[290px] md:w-[420px] transition-all duration-500 ease-out" style={style}>
                <button onClick={() => (isActive ? onOpenCar(car) : setActive(i))}
                  className={`block w-full text-left bg-[#FBFAF6] border ${isActive ? 'border-[#141310]' : 'border-[#141310]/30'}`}>
                  <div className="relative">
                    <img src={media(car.image, 700, 460)} alt={`${car.brand} ${car.name}`} className="w-full h-[290px] md:h-[310px] object-cover" />
                    {!isActive && <div className="absolute inset-0 bg-[#EDE9E0]/40" />}
                    <div className="absolute left-0 top-4 bg-[#FF3B00] text-white font-mono2 text-[10px] uppercase tracking-widest px-3 py-1">{FUEL_LABEL[car.fuel]}</div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#141310] px-4 py-3">
                    <div className="min-w-0">
                      <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#6B675E]">{car.brand} · {car.year}</div>
                      <div className="font-display uppercase text-lg truncate">{car.name}</div>
                    </div>
                    <div className="font-display text-lg text-[#FF3B00] whitespace-nowrap ml-3">{priceLabel(car)}</div>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={() => go(-1)} className="h-11 w-11 grid place-items-center border border-[#141310] hover:bg-[#141310] hover:text-[#EDE9E0] transition rounded-full"><ChevronLeft className="h-5 w-5" /></button>
          <div className="flex gap-2">
            {cars.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all ${i === active ? 'w-8 bg-[#FF3B00]' : 'w-2 bg-[#141310]/25 hover:bg-[#141310]/50'}`} />
            ))}
          </div>
          <button onClick={() => go(1)} className="h-11 w-11 grid place-items-center border border-[#141310] hover:bg-[#141310] hover:text-[#EDE9E0] transition rounded-full"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <div className="mt-8 text-center">
          <a href="/ponuka" className="inline-flex items-center gap-2 bg-[#141310] text-[#EDE9E0] px-6 py-3.5 font-mono2 text-xs uppercase tracking-widest hover:bg-[#FF3B00] hover:text-white transition rounded-full">
            Zobraziť celú ponuku <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ================= CAR CARD ================= */
export function CarCard({ car, onOpenCar }) {
  return (
    <Tilt max={6}>
      <button onClick={() => onOpenCar(car)} className="group block w-full h-full text-left bg-[#FBFAF6] border border-[#141310]/15 hover:border-[#141310] transition">
        <div className="relative overflow-hidden">
          <img src={media(car.image, 640, 420)} alt={`${car.brand} ${car.name}`} className="w-full h-52 object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute left-0 top-4 bg-[#FF3B00] text-white font-mono2 text-[10px] uppercase tracking-widest px-3 py-1">{FUEL_LABEL[car.fuel]}</div>
          {car.dph && <div className="absolute right-0 top-4 bg-[#141310] text-[#EDE9E0] font-mono2 text-[10px] uppercase tracking-widest px-3 py-1">DPH</div>}
        </div>
        <div className="p-5">
          <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#6B675E]">{car.brand} · {car.year}</div>
          <h3 className="mt-1 font-display uppercase text-xl leading-tight truncate">{car.name}</h3>
          <div className="mt-4 flex items-center gap-4 font-mono2 text-xs text-[#3a382f]">
            <span className="inline-flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-[#FF3B00]" />{kmLabel(car.mileage)}</span>
            <span className="inline-flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5 text-[#FF3B00]" />{car.power} kW</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#141310]/12 pt-4">
            <span className="font-display text-2xl text-[#FF3B00]">{priceLabel(car)}</span>
            <span className="grid place-items-center h-9 w-9 bg-[#141310] text-[#EDE9E0] group-hover:bg-[#FF3B00] transition rounded-full"><Plus className="h-4 w-4" /></span>
          </div>
        </div>
      </button>
    </Tilt>
  )
}

/* ================= INVENTORY ================= */
export function Inventory({ cars, onOpenCar, showHeader = true }) {
  const [fuel, setFuel] = useState('all')
  const [brand, setBrand] = useState('all')
  const [sort, setSort] = useState('default')
  const brands = useMemo(() => ['all', ...Array.from(new Set(cars.map((c) => c.brand))).sort()], [cars])
  const fuels = ['all', 'benzín', 'diesel', 'elektro', 'hybrid']
  const filtered = useMemo(() => {
    let list = cars.filter((c) => (fuel === 'all' || c.fuel === fuel) && (brand === 'all' || c.brand === brand))
    if (sort === 'price-asc') list = [...list].sort((a, b) => (a.price || 1e9) - (b.price || 1e9))
    if (sort === 'price-desc') list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0))
    if (sort === 'km-asc') list = [...list].sort((a, b) => a.mileage - b.mileage)
    return list
  }, [cars, fuel, brand, sort])
  return (
    <section id="ponuka" className="py-10 scroll-mt-20">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        {showHeader && (
          <div className="mb-6">
            <Label n="/">Ponuka vozidiel</Label>
            <h2 className="mt-3 font-display uppercase text-5xl md:text-7xl">Sklad vozidiel</h2>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 border-y border-[#141310]/15 py-4">
          {fuels.map((f) => (
            <button key={f} onClick={() => setFuel(f)}
              className={`px-4 py-2 font-mono2 text-xs uppercase tracking-widest transition rounded-full border ${fuel === f ? 'bg-[#141310] text-[#EDE9E0] border-[#141310]' : 'border-[#141310]/25 text-[#141310] hover:border-[#141310]'}`}>
              {f === 'all' ? 'Všetky' : FUEL_LABEL[f]}
            </button>
          ))}
          <div className="flex gap-2 md:ml-auto">
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="bg-transparent border border-[#141310]/25 px-4 py-2 font-mono2 text-xs uppercase tracking-widest outline-none rounded-full focus:border-[#FF3B00]">
              {brands.map((b) => <option key={b} value={b}>{b === 'all' ? 'Všetky značky' : b}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border border-[#141310]/25 px-4 py-2 font-mono2 text-xs uppercase tracking-widest outline-none rounded-full focus:border-[#FF3B00]">
              <option value="default">Zoradiť</option>
              <option value="price-asc">Cena ↑</option>
              <option value="price-desc">Cena ↓</option>
              <option value="km-asc">Najmenej km</option>
            </select>
          </div>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((car) => <CarCard key={car.id} car={car} onOpenCar={onOpenCar} />)}
        </div>
        {filtered.length === 0 && <div className="mt-12 text-center font-mono2 text-[#6B675E]">Žiadne vozidlá pre zvolený filter.</div>}
      </div>
    </section>
  )
}

/* ================= WHY US ================= */
export function WhyUs() {
  return (
    <section className="ink py-14 border-y border-[#141310]">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="font-mono2 text-xs uppercase tracking-[0.2em] text-[#FF3B00]">04 /</span>
          <span className="font-mono2 text-xs uppercase tracking-[0.2em] text-[#EDE9E0]/60">Prečo SICOCars</span>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#EDE9E0]/15 border-y border-[#EDE9E0]/15">
          {WHY.map((w, i) => (
            <div key={w} className="py-6 md:py-2 md:px-5 flex md:block items-center gap-4">
              <div className="font-display text-4xl text-[#FF3B00]">{String(i + 1).padStart(2, '0')}</div>
              <div className="md:mt-3 font-display uppercase text-xl text-[#EDE9E0] leading-tight">{w}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= FINANCING ================= */
function RangeRow({ label, value, min, max, step, onChange, suffix }) {
  return (
    <div>
      <div className="flex justify-between font-mono2 text-xs uppercase tracking-widest mb-2">
        <span className="text-[#EDE9E0]/70">{label}</span>
        <span className="text-[#EDE9E0]">{eur(value)} {suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#FF3B00] cursor-pointer" />
    </div>
  )
}
export function Financing() {
  const [price, setPrice] = useState(15000)
  const [down, setDown] = useState(3000)
  const [months, setMonths] = useState(60)
  const monthly = useMemo(() => {
    const principal = Math.max(price - down, 0)
    const r = 0.069 / 12
    const m = (principal * r) / (1 - Math.pow(1 + r, -months))
    return isFinite(m) && m > 0 ? Math.round(m) : 0
  }, [price, down, months])
  return (
    <section id="financovanie" className="py-16 scroll-mt-16 border-t border-[#141310]/12">
      <div className="container mx-auto px-5 md:px-8 lg:px-12 grid lg:grid-cols-2 gap-8 items-stretch">
        <div>
          <Label n="05 /">Financovanie a leasing</Label>
          <h2 className="mt-3 font-display uppercase text-5xl md:text-7xl leading-[0.9]">Auto<br />na splátky</h2>
          <p className="mt-6 max-w-md text-[#3a382f]">Dokážeme vám pomôcť s financovaním vozidla. Doba schválenia už <span className="font-semibold text-[#141310]">do 2 hodín</span>! Spočítajte si orientačnú mesačnú splátku.</p>
          <p className="mt-4 font-mono2 text-xs uppercase tracking-widest text-[#6B675E]">* Orientačný výpočet, RPMN sa môže líšiť</p>
        </div>
        <div className="ink p-8">
          <div className="space-y-6">
            <RangeRow label="Cena vozidla" value={price} min={3000} max={40000} step={500} onChange={setPrice} suffix="€" />
            <RangeRow label="Akontácia" value={down} min={0} max={Math.round(price * 0.6)} step={500} onChange={setDown} suffix="€" />
            <RangeRow label="Doba splácania" value={months} min={12} max={96} step={12} onChange={setMonths} suffix="mes." />
          </div>
          <div className="mt-8 flex items-end justify-between border-t border-[#EDE9E0]/15 pt-6">
            <div>
              <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#EDE9E0]/60">Mesačná splátka od</div>
              <div className="font-display text-5xl text-[#FF3B00]">{eur(monthly)} €</div>
            </div>
            <a href="/#kontakt" className="bg-[#FF3B00] text-white px-5 py-3 font-mono2 text-xs uppercase tracking-widest hover:bg-[#EDE9E0] hover:text-[#141310] transition rounded-full">Chcem to</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================= TESTIMONIALS ================= */
export function Testimonials() {
  return (
    <section id="referencie" className="py-16 scroll-mt-16 border-t border-[#141310]/12">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <Label n="06 /">Napísali o nás</Label>
        <h2 className="mt-3 font-display uppercase text-5xl md:text-7xl">Referencie</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="border border-[#141310]/15 bg-[#FBFAF6] p-7 flex flex-col">
              <div className="font-display text-6xl text-[#FF3B00] leading-none">“</div>
              <p className="mt-2 text-[#3a382f] leading-relaxed flex-1">{t.text}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-[#141310]/12 pt-4">
                <span className="grid place-items-center h-9 w-9 bg-[#141310] text-[#EDE9E0] font-display rounded-full">{t.name[0]}</span>
                <span className="font-mono2 text-xs uppercase tracking-widest">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= CONTACT ================= */
export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || (!form.email && !form.phone)) { toast.error('Vyplňte meno a aspoň jeden kontakt (email alebo telefón).'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, type: 'general' }) })
      if (!res.ok) throw new Error()
      toast.success('Ďakujeme! Ozveme sa vám čo najskôr.')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch { toast.error('Niečo sa pokazilo. Skúste to znova.') } finally { setLoading(false) }
  }
  const hours = [
    ['Po – Pia', '9:00 – 18:00'], ['Sobota', 'Dohodou'], ['Nedeľa', 'Dohodou'],
  ]
  return (
    <section id="kontakt" className="py-16 scroll-mt-16 border-t border-[#141310]/12">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <Label n="07 /">Kontakt</Label>
        <h2 className="mt-3 font-display uppercase text-5xl md:text-7xl">Príďte k nám</h2>

        <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="border border-[#141310]/15 bg-[#FBFAF6] p-6">
              <div className="font-display uppercase text-2xl">{COMPANY.name}</div>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#FF3B00] shrink-0 mt-0.5" />
                  <span>{COMPANY.street}, {COMPANY.zip}<br />{COMPANY.country}</span>
                </div>
                <a href={`tel:${COMPANY.phoneHref}`} className="flex items-center gap-3 hover:text-[#FF3B00]">
                  <Phone className="h-5 w-5 text-[#FF3B00]" /> <span className="font-mono2">{COMPANY.phone}</span>
                </a>
                {COMPANY.emails.map((em) => (
                  <a key={em} href={`mailto:${em}`} className="flex items-center gap-3 hover:text-[#FF3B00]">
                    <Mail className="h-5 w-5 text-[#FF3B00]" /> <span className="font-mono2">{em}</span>
                  </a>
                ))}
              </div>
              <a href={MAP_DIR} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#FF3B00] text-white px-5 py-3 font-mono2 text-xs uppercase tracking-widest hover:bg-[#141310] transition rounded-full">
                <Navigation className="h-4 w-4" /> Navigovať k nám
              </a>
            </div>

            <div className="mt-5 border border-[#141310] p-1.5 bg-[#FBFAF6]">
              <iframe title="Mapa SICO Cars" src={MAP_EMBED} className="w-full h-[240px] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>

            <div className="mt-5 border border-[#141310]/15 bg-[#FBFAF6] p-6">
              <div className="flex items-center gap-2 font-mono2 text-xs uppercase tracking-widest mb-3"><Clock className="h-4 w-4 text-[#FF3B00]" /> Otváracie hodiny</div>
              {hours.map(([d, h]) => (
                <div key={d} className="flex justify-between border-b border-[#141310]/10 py-2 last:border-0 font-mono2 text-sm">
                  <span className="text-[#6B675E] uppercase">{d}</span><span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="border border-[#141310] bg-[#FBFAF6] p-7">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-mono2 text-[10px] uppercase tracking-widest text-[#6B675E]">Meno a priezvisko *</label>
                <Input value={form.name} onChange={set('name')} placeholder="Vaše meno" className="mt-1.5 rounded-none border-[#141310]/25 bg-transparent" />
              </div>
              <div>
                <label className="font-mono2 text-[10px] uppercase tracking-widest text-[#6B675E]">Email</label>
                <Input type="email" value={form.email} onChange={set('email')} placeholder="email@..." className="mt-1.5 rounded-none border-[#141310]/25 bg-transparent" />
              </div>
              <div>
                <label className="font-mono2 text-[10px] uppercase tracking-widest text-[#6B675E]">Telefón</label>
                <Input value={form.phone} onChange={set('phone')} placeholder="+421..." className="mt-1.5 rounded-none border-[#141310]/25 bg-transparent" />
              </div>
              <div className="sm:col-span-2">
                <label className="font-mono2 text-[10px] uppercase tracking-widest text-[#6B675E]">Správa</label>
                <Textarea value={form.message} onChange={set('message')} rows={5} placeholder="O ktoré vozidlo máte záujem?" className="mt-1.5 rounded-none border-[#141310]/25 bg-transparent" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-5 w-full bg-[#141310] text-[#EDE9E0] py-4 font-mono2 text-xs uppercase tracking-widest hover:bg-[#FF3B00] hover:text-white transition rounded-full disabled:opacity-60">
              {loading ? 'Odosielam…' : 'Odoslať dopyt'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

/* ================= FOOTER ================= */
export function Footer() {
  return (
    <footer className="ink py-12 border-t border-[#141310]">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="font-display uppercase text-[12vw] leading-[0.8] text-[#EDE9E0]">
          SICO<span className="text-[#FF3B00]">CARS</span>
        </div>
        <div className="mt-8 flex flex-col md:flex-row justify-between gap-4 border-t border-[#EDE9E0]/15 pt-6 font-mono2 text-xs uppercase tracking-widest text-[#EDE9E0]/60">
          <span>{COMPANY.name} · {COMPANY.street}, {COMPANY.zip}</span>
          <span>{COMPANY.phone}</span>
          <span>© {new Date().getFullYear()} — rozumieme autám</span>
        </div>
      </div>
    </footer>
  )
}

/* ================= CAR DIALOG ================= */
export function CarDialog({ car, open, onOpenChange }) {
  const [img, setImg] = useState(0)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  useEffect(() => { setImg(0); setSent(false); setForm({ name: '', phone: '', email: '' }) }, [car])
  if (!car) return null
  const images = [car.image, car.image2].filter(Boolean)
  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || (!form.phone && !form.email)) { toast.error('Meno a kontakt sú povinné.'); return }
    try {
      const res = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, type: 'car', carId: car.id, carName: `${car.brand} ${car.name}` }) })
      if (!res.ok) throw new Error()
      setSent(true); toast.success('Dopyt odoslaný! Ozveme sa vám.')
    } catch { toast.error('Niečo sa pokazilo.') }
  }
  const specs = [
    { icon: Calendar, label: 'Rok', value: car.year },
    { icon: Gauge, label: 'Najazdené', value: kmLabel(car.mileage) },
    { icon: Fuel, label: 'Výkon', value: `${car.power} kW` },
    { icon: Fuel, label: 'Palivo', value: FUEL_LABEL[car.fuel] },
    { icon: Cog, label: 'Prevodovka', value: car.transmission },
    { icon: Car, label: 'Karoséria', value: car.body },
  ]
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-[#EDE9E0] border-[#141310] rounded-none max-h-[92vh] overflow-y-auto">
        <div className="relative">
          <img src={media(images[img], 900, 560)} alt={car.name} className="w-full h-72 md:h-80 object-cover" />
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (<button key={i} onClick={() => setImg(i)} className={`h-2 rounded-full transition-all ${i === img ? 'w-7 bg-[#FF3B00]' : 'w-2 bg-white/70'}`} />))}
            </div>
          )}
          <div className="absolute left-0 top-4 bg-[#FF3B00] text-white font-mono2 text-[10px] uppercase tracking-widest px-3 py-1">{FUEL_LABEL[car.fuel]}</div>
          {car.dph && <div className="absolute right-0 top-4 bg-[#141310] text-[#EDE9E0] font-mono2 text-[10px] uppercase tracking-widest px-3 py-1">Odpočet DPH</div>}
        </div>
        <div className="p-6">
          <DialogHeader>
            <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#6B675E]">{car.brand} · {car.year}</div>
            <DialogTitle className="font-display uppercase text-3xl text-[#141310]">{car.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-1 font-display text-3xl text-[#FF3B00]">{priceLabel(car)}{car.dph ? ' s DPH' : ''}</div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 border-t border-l border-[#141310]/15">
            {specs.map((s) => (
              <div key={s.label} className="border-b border-r border-[#141310]/15 p-3">
                <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#6B675E]">{s.label}</div>
                <div className="mt-1 font-display uppercase text-sm">{s.value}</div>
              </div>
            ))}
          </div>
          {car.youtube && (
            <a href={car.youtube} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-mono2 text-xs uppercase tracking-widest hover:text-[#FF3B00]">
              <Youtube className="h-5 w-5 text-[#FF3B00]" /> Pozrieť video vozidla
            </a>
          )}
          <div className="mt-6 border-t border-[#141310]/15 pt-5">
            {sent ? (
              <div className="text-center py-4">
                <BadgeCheck className="h-10 w-10 mx-auto text-[#FF3B00]" />
                <p className="mt-2 font-display uppercase text-xl">Ďakujeme za dopyt!</p>
                <p className="text-sm text-[#6B675E]">Ozveme sa vám čo najskôr.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="font-mono2 text-xs uppercase tracking-widest mb-3">Mám záujem o toto vozidlo</div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Input placeholder="Meno *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-none border-[#141310]/25 bg-transparent" />
                  <Input placeholder="Telefón" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="rounded-none border-[#141310]/25 bg-transparent" />
                  <Input placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="rounded-none border-[#141310]/25 bg-transparent" />
                </div>
                <button type="submit" className="mt-3 w-full bg-[#141310] text-[#EDE9E0] py-3.5 font-mono2 text-xs uppercase tracking-widest hover:bg-[#FF3B00] hover:text-white transition rounded-full">Odoslať dopyt</button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
