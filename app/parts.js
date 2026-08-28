'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Car, Gauge, Fuel, Calendar, Cog, ArrowRight, ChevronLeft, ChevronRight,
  Phone, Mail, MapPin, Clock, Menu, X, Youtube, Navigation, Check, Plus,
} from 'lucide-react'
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
export const monthlyFrom = (price, months = 72) => {
  if (!price) return null
  const r = 0.069 / 12
  const m = (price * r) / (1 - Math.pow(1 + r, -months))
  return isFinite(m) && m > 0 ? Math.round(m) : null
}
export const FUEL_LABEL = { diesel: 'Diesel', 'benzín': 'Benzín', elektro: 'Elektro', hybrid: 'Hybrid' }
export const carHref = (c) => `/vozidlo/${c.id}`
export const ytEmbed = (url) => {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

/* ---------- data hook ---------- */
export function useCars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/cars').then((r) => r.json())
      .then((d) => setCars(Array.isArray(d) ? d.filter((c) => !c.sold) : []))
      .catch(() => setCars([]))
      .finally(() => setLoading(false))
  }, [])
  return { cars, loading }
}

/* ---------- Tilt ---------- */
export function Tilt({ children, className = '', max = 6 }) {
  const ref = useRef(null)
  const [t, setT] = useState({ rx: 0, ry: 0 })
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setT({ rx: -py * max, ry: px * max })
  }
  const reset = () => setT({ rx: 0, ry: 0 })
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={`h-full w-full max-w-full perspective-1000 ${className}`}>
      <div className="h-full preserve-3d transition-transform duration-300 ease-out" style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}>
        {children}
      </div>
    </div>
  )
}

/* ---------- label ---------- */
export function Label({ n, children }) {
  return (
    <span className="text-[11px] uppercase tracking-[0.35em] text-[#C4A667] font-medium">
      {n && <span className="text-[#EFEAD9]/30 mr-3">{n}</span>}{children}
    </span>
  )
}
function Rule() { return <span className="hidden sm:block h-px flex-1 bg-[#EFEAD9]/12" /> }

/* ---------- content ---------- */
const SERVICES = [
  { n: 'I', title: 'Predaj a výkup áut', desc: 'Vykúpime vaše vozidlo za férovú cenu — rýchlo a bez starostí.' },
  { n: 'II', title: 'Individuálny dovoz', desc: 'Dovezieme presne to auto, ktoré si želáte, aj na objednávku zo zahraničia.' },
  { n: 'III', title: 'Komisionálny predaj', desc: 'Predáme vaše auto za vás — postaráme sa o celý proces.' },
  { n: 'IV', title: 'Financovanie a leasing', desc: 'Schválenie úveru už do 2 hodín. Leasing šitý na mieru.' },
  { n: 'V', title: 'Poistenie vozidiel', desc: 'PZP aj havarijné poistenie vybavíme priamo na mieste.' },
  { n: 'VI', title: 'Profesionálny Chip-Tuning', desc: 'Zvýšenie výkonu a optimalizácia motora od profesionálov.' },
]
const WHY = ['Certifikované vozidlá', 'Overené kilometre', 'Individuálny dovoz', 'Testovacia jazda', 'Servisná história']
const TESTIMONIALS = [
  { name: 'Majky', text: 'Spokojnosť s autom, autobazárom a tiež s predajcom. Auto bolo pripravené vo výbornom stave, čisté na okamžité jazdenie. Predajca je seriózny človek.' },
  { name: 'Silvia', text: 'Maximálna spokojnosť.. od prvého kontaktu s predávajúcim.. až po kúpu vozidla.. milý príjemný komunikatívny pán... kúpené už tretie vozidlo u tohto pána.' },
  { name: 'Lukáš', text: 'Najlepší predajca áut široko ďaleko.. Profesionálny prístup, ochota pomôcť, výber kvalitných jazdených áut. Určite odporúčam!' },
]
const TICKER = ['Predaj', 'Výkup', 'Individuálny dovoz', 'Komisionálny predaj', 'Leasing', 'Poistenie', 'Chip-Tuning']
const BRANDS = ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Škoda', 'Hyundai', 'KIA', 'Toyota', 'Ford', 'Opel', 'Nissan', 'Peugeot']

const btnGold = 'inline-flex items-center justify-center gap-2 bg-[#C4A667] text-[#0E1A14] px-6 py-3.5 text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-[#EAD9AE] transition rounded-full'
const btnOutline = 'inline-flex items-center justify-center gap-2 border border-[#C4A667]/50 text-[#C4A667] px-6 py-3.5 text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-[#C4A667] hover:text-[#0E1A14] transition rounded-full'

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
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[#0E1A14]/90 backdrop-blur border-b border-[#EFEAD9]/10' : 'border-b border-transparent'}`}>
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[72px]">
          <a href="/" className="flex items-center gap-3">
            <span className="grid place-items-center h-10 w-10 border border-[#C4A667]/60 text-[#C4A667] font-display text-xl">S</span>
            <div className="leading-none">
              <div className="font-display text-2xl">Sico<span className="italic text-[#C4A667]"> Cars</span></div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#8C948A] mt-1">rozumieme autám</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-[11px] uppercase tracking-[0.25em] text-[#EFEAD9]/80 hover:text-[#C4A667] transition">{l.label}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:+421948484177" className="text-[11px] uppercase tracking-[0.2em] text-[#EFEAD9]/70 hover:text-[#C4A667] transition">+421 948 484 177</a>
            <a href="/#kontakt" className={btnGold + ' !py-2.5 !px-5'}>Mám záujem</a>
          </div>
          <button className="md:hidden p-2 text-[#EFEAD9]" onClick={() => setOpen((v) => !v)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0E1A14] border-b border-[#EFEAD9]/10 overflow-hidden">
            <div className="container mx-auto px-5 py-3 flex flex-col">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-xs uppercase tracking-[0.25em] border-b border-[#EFEAD9]/8 last:border-0">{l.label}</a>
              ))}
              <a href="/#kontakt" onClick={() => setOpen(false)} className={btnGold + ' mt-3'}>Mám záujem</a>
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
    <div className="py-3.5 overflow-hidden border-y border-[#EFEAD9]/10 bg-[#0A140F]">
      <div className="flex w-max animate-marquee-fast items-center">
        {row.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="mx-7 text-sm uppercase tracking-[0.3em] text-[#EFEAD9]/70">{t}</span>
            <span className="text-[#C4A667] text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ================= HERO ================= */
export function Hero({ heroCar, onOpenCar }) {
  return (
    <section id="top" className="relative pt-32 md:pt-36 pb-12">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-5">
              <span className="text-[11px] uppercase tracking-[0.35em] text-[#C4A667] whitespace-nowrap">Prémiový výber vozidiel</span>
              <Rule />
            </div>
            <h1 className="mt-7 font-display font-medium leading-[0.95] text-5xl sm:text-6xl lg:text-7xl xl:text-[6.5rem]">
              Rozumieme<br /><span className="italic gold-gradient">autám</span>
            </h1>
            <p className="mt-7 max-w-lg text-[#B7B4A1] text-lg font-light leading-relaxed">
              Certifikované jazdené vozidlá s overenými kilometrami, individuálny dovoz na mieru
              a financovanie so schválením už <span className="text-[#EFEAD9]">do 2 hodín</span>.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="/ponuka" className={btnGold}>Prehliadať kolekciu <ArrowRight className="h-4 w-4" /></a>
              <a href="/#kontakt" className={btnOutline}>Vykúpime vaše auto</a>
            </div>
          </div>

          {heroCar && (
            <div className="lg:col-span-5">
              <Tilt max={7}>
                <div className="relative border border-[#C4A667]/40 bg-[#13211A]">
                  <div className="relative overflow-hidden">
                    <img src={media(heroCar.image, 800, 560)} alt={`${heroCar.brand} ${heroCar.name}`} className="w-full h-[300px] md:h-[360px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A14]/60 to-transparent" />
                  </div>
                  <div className="flex items-center justify-between border-t border-[#C4A667]/30 px-5 py-4">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#8C948A]">{heroCar.brand} · {heroCar.year}</div>
                      <div className="font-display text-xl truncate">{heroCar.name}</div>
                      <div className="mt-1 font-display text-lg text-[#C4A667]">{priceLabel(heroCar)}</div>
                    </div>
                    <a href={carHref(heroCar)} className="shrink-0 grid place-items-center h-11 w-11 border border-[#C4A667]/50 text-[#C4A667] hover:bg-[#C4A667] hover:text-[#0E1A14] transition rounded-full">
                      <Plus className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </Tilt>
              <div className="mt-5 grid grid-cols-3 divide-x divide-[#EFEAD9]/10 border-y border-[#EFEAD9]/10">
                {[['30+', 'v kolekcii'], ['2 h', 'schválenie'], ['100%', 'overené km']].map(([a, b]) => (
                  <div key={b} className="px-3 py-4 text-center">
                    <div className="font-display text-3xl text-[#C4A667]">{a}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#8C948A] mt-1">{b}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-14 border-t border-[#EFEAD9]/10 pt-6 overflow-hidden">
          <div className="flex w-max animate-marquee gap-12 items-center">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="font-display text-2xl text-[#EFEAD9]/20 whitespace-nowrap">{b}</span>
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
    <section id="sluzby" className="py-20 scroll-mt-16 border-t border-[#EFEAD9]/10">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex items-end justify-between gap-8 flex-wrap">
          <div>
            <Label n="02">Naše služby</Label>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">Všetko pod<br /><span className="italic text-[#C4A667]">jednou strechou</span></h2>
          </div>
          <p className="max-w-sm text-[#B7B4A1] font-light">Od výkupu a dovozu, cez financovanie až po chip-tuning — postaráme sa o všetko na jednom mieste.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#EFEAD9]/10">
          {SERVICES.map((s) => (
            <div key={s.n} className="group relative border-b border-r border-[#EFEAD9]/10 p-8 transition-colors hover:bg-[#C4A667]/[0.05]">
              <div className="flex items-start justify-between">
                <span className="font-display text-2xl text-[#C4A667]">{s.n}</span>
                <ArrowRight className="h-5 w-5 -rotate-45 text-[#C4A667]/40 group-hover:text-[#C4A667] group-hover:rotate-0 transition" />
              </div>
              <h3 className="mt-10 font-display text-2xl leading-snug">{s.title}</h3>
              <p className="mt-3 text-sm text-[#8C948A] font-light leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= COVERFLOW ================= */
export function Coverflow({ cars, onOpenCar }) {
  const router = useRouter()
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
    <section className="py-20 border-t border-[#EFEAD9]/10 overflow-hidden">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="text-center">
          <Label n="03">Vybraná kolekcia</Label>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Súkromný <span className="italic text-[#C4A667]">showroom</span></h2>
        </div>
        <div className="relative mt-12 h-[400px] md:h-[440px] perspective-2000 preserve-3d">
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
                <a href={carHref(car)} onClick={(e) => { if (!isActive) { e.preventDefault(); setActive(i) } }}
                  className={`block w-full text-left bg-[#13211A] border ${isActive ? 'border-[#C4A667]' : 'border-[#EFEAD9]/15'}`}
                  style={{ boxShadow: isActive ? '0 30px 70px -25px rgba(196,166,103,0.4)' : '0 20px 50px -25px rgba(0,0,0,0.8)' }}>
                  <div className="relative">
                    <img src={media(car.image, 700, 460)} alt={`${car.brand} ${car.name}`} className="w-full h-[290px] md:h-[310px] object-cover" />
                    {!isActive && <div className="absolute inset-0 bg-[#0E1A14]/50" />}
                    <div className="absolute left-4 top-4 border border-[#C4A667]/60 bg-[#0E1A14]/70 text-[#C4A667] text-[10px] uppercase tracking-[0.2em] px-3 py-1">{FUEL_LABEL[car.fuel]}</div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#EFEAD9]/12 px-5 py-4">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#8C948A]">{car.brand} · {car.year}</div>
                      <div className="font-display text-lg truncate">{car.name}</div>
                    </div>
                    <div className="font-display text-lg text-[#C4A667] whitespace-nowrap ml-3">{priceLabel(car)}</div>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={() => go(-1)} className="h-11 w-11 grid place-items-center border border-[#EFEAD9]/25 hover:border-[#C4A667] hover:text-[#C4A667] transition rounded-full"><ChevronLeft className="h-5 w-5" /></button>
          <div className="flex gap-2">
            {cars.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-8 bg-[#C4A667]' : 'w-1.5 bg-[#EFEAD9]/25 hover:bg-[#EFEAD9]/50'}`} />
            ))}
          </div>
          <button onClick={() => go(1)} className="h-11 w-11 grid place-items-center border border-[#EFEAD9]/25 hover:border-[#C4A667] hover:text-[#C4A667] transition rounded-full"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <div className="mt-10 text-center">
          <a href="/ponuka" className={btnOutline}>Zobraziť celú kolekciu <ArrowRight className="h-4 w-4" /></a>
        </div>
      </div>
    </section>
  )
}

/* ================= CAR CARD ================= */
export function CarCard({ car, onOpenCar }) {
  return (
    <Tilt max={5}>
      <a href={carHref(car)} className="group block w-full h-full text-left bg-[#13211A] border border-[#EFEAD9]/12 hover:border-[#C4A667]/60 transition duration-300">
        <div className="relative overflow-hidden">
          <img src={media(car.image, 640, 420)} alt={`${car.brand} ${car.name}`} className="w-full h-52 object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A14]/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
          <div className="absolute left-4 top-4 border border-[#C4A667]/60 bg-[#0E1A14]/70 text-[#C4A667] text-[10px] uppercase tracking-[0.2em] px-3 py-1">{FUEL_LABEL[car.fuel]}</div>
          {car.dph && <div className="absolute right-4 top-4 border border-[#EFEAD9]/25 bg-[#0E1A14]/70 text-[#EFEAD9]/80 text-[10px] uppercase tracking-[0.2em] px-3 py-1">DPH</div>}
        </div>
        <div className="p-6">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#8C948A]">{car.brand} · {car.year}</div>
          <h3 className="mt-1.5 font-display text-2xl leading-tight truncate">{car.name}</h3>
          <div className="mt-4 flex items-center gap-5 text-sm text-[#B7B4A1] font-light">
            <span className="inline-flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-[#C4A667]" />{kmLabel(car.mileage)}</span>
            <span className="inline-flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5 text-[#C4A667]" />{car.power} kW</span>
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-[#EFEAD9]/12 pt-5">
            <div>
              <span className="font-display text-2xl text-[#C4A667]">{priceLabel(car)}</span>
              {monthlyFrom(car.price) && (
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#8C948A] mt-1">od {eur(monthlyFrom(car.price))} €/mes</div>
              )}
            </div>
            <span className="grid place-items-center h-10 w-10 border border-[#C4A667]/50 text-[#C4A667] group-hover:bg-[#C4A667] group-hover:text-[#0E1A14] transition rounded-full"><Plus className="h-4 w-4" /></span>
          </div>
        </div>
      </a>
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
  const selCls = 'bg-transparent border border-[#EFEAD9]/20 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#EFEAD9] outline-none rounded-full focus:border-[#C4A667] [&>option]:bg-[#13211A]'
  return (
    <section id="ponuka" className="py-10 scroll-mt-20">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        {showHeader && (
          <div className="mb-8">
            <Label>Kolekcia</Label>
            <h2 className="mt-4 font-display text-4xl md:text-6xl">Sklad vozidiel</h2>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 border-y border-[#EFEAD9]/12 py-5">
          {fuels.map((f) => (
            <button key={f} onClick={() => setFuel(f)}
              className={`px-5 py-2 text-[11px] uppercase tracking-[0.2em] transition rounded-full border ${fuel === f ? 'bg-[#C4A667] text-[#0E1A14] border-[#C4A667]' : 'border-[#EFEAD9]/20 text-[#EFEAD9]/80 hover:border-[#C4A667] hover:text-[#C4A667]'}`}>
              {f === 'all' ? 'Všetky' : FUEL_LABEL[f]}
            </button>
          ))}
          <div className="flex gap-2 md:ml-auto">
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className={selCls}>
              {brands.map((b) => <option key={b} value={b}>{b === 'all' ? 'Všetky značky' : b}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={selCls}>
              <option value="default">Zoradiť</option>
              <option value="price-asc">Cena ↑</option>
              <option value="price-desc">Cena ↓</option>
              <option value="km-asc">Najmenej km</option>
            </select>
          </div>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
        {filtered.length === 0 && <div className="mt-12 text-center text-[#8C948A]">Žiadne vozidlá pre zvolený filter.</div>}
      </div>
    </section>
  )
}

/* ================= WHY US ================= */
export function WhyUs() {
  return (
    <section className="py-16 border-y border-[#EFEAD9]/10 bg-[#0A140F]">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#C4A667]">04 — Prečo SICO Cars</span>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#EFEAD9]/10 border-y border-[#EFEAD9]/10">
          {WHY.map((w, i) => (
            <div key={w} className="py-6 md:py-3 md:px-6 flex md:block items-center gap-5">
              <div className="font-display text-4xl text-[#C4A667]">{String(i + 1).padStart(2, '0')}</div>
              <div className="md:mt-3 font-display text-xl leading-snug">{w}</div>
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
      <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] mb-2.5">
        <span className="text-[#8C948A]">{label}</span>
        <span className="text-[#EFEAD9]">{eur(value)} {suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#C4A667] cursor-pointer" />
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
    <section id="financovanie" className="py-20 scroll-mt-16 border-t border-[#EFEAD9]/10">
      <div className="container mx-auto px-5 md:px-8 lg:px-12 grid lg:grid-cols-2 gap-10 items-stretch">
        <div>
          <Label n="05">Financovanie a leasing</Label>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">Auto na<br /><span className="italic text-[#C4A667]">splátky</span></h2>
          <p className="mt-7 max-w-md text-[#B7B4A1] font-light leading-relaxed">Dokážeme vám pomôcť s financovaním vozidla. Doba schválenia už <span className="text-[#EFEAD9]">do 2 hodín</span>. Spočítajte si orientačnú mesačnú splátku.</p>
          <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-[#8C948A]">* Orientačný výpočet, RPMN sa môže líšiť</p>
        </div>
        <div className="bg-[#13211A] border border-[#EFEAD9]/12 p-8 md:p-10">
          <div className="space-y-7">
            <RangeRow label="Cena vozidla" value={price} min={3000} max={40000} step={500} onChange={setPrice} suffix="€" />
            <RangeRow label="Akontácia" value={down} min={0} max={Math.round(price * 0.6)} step={500} onChange={setDown} suffix="€" />
            <RangeRow label="Doba splácania" value={months} min={12} max={96} step={12} onChange={setMonths} suffix="mes." />
          </div>
          <div className="mt-9 flex items-end justify-between border-t border-[#EFEAD9]/12 pt-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#8C948A]">Mesačná splátka od</div>
              <div className="font-display text-5xl text-[#C4A667]">{eur(monthly)} €</div>
            </div>
            <a href="/#kontakt" className={btnGold}>Chcem to</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================= TESTIMONIALS ================= */
export function Testimonials() {
  return (
    <section id="referencie" className="py-20 scroll-mt-16 border-t border-[#EFEAD9]/10">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <Label n="06">Napísali o nás</Label>
        <h2 className="mt-4 font-display text-4xl md:text-6xl">Referencie</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="border border-[#EFEAD9]/12 bg-[#13211A] p-8 flex flex-col">
              <div className="font-display text-7xl text-[#C4A667] leading-[0.5] h-8">“</div>
              <p className="mt-6 text-[#CFCBBA] font-light italic leading-relaxed flex-1">{t.text}</p>
              <div className="mt-7 flex items-center gap-3 border-t border-[#EFEAD9]/12 pt-5">
                <span className="grid place-items-center h-10 w-10 border border-[#C4A667]/50 text-[#C4A667] font-display rounded-full">{t.name[0]}</span>
                <span className="text-[11px] uppercase tracking-[0.25em]">{t.name}</span>
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
  const hours = [['Po – Pia', '9:00 – 18:00'], ['Sobota', 'Dohodou'], ['Nedeľa', 'Dohodou']]
  const inputCls = 'mt-1.5 rounded-none border-[#EFEAD9]/20 bg-transparent text-[#EFEAD9] placeholder:text-[#5f665d] focus-visible:ring-[#C4A667]'
  return (
    <section id="kontakt" className="py-20 scroll-mt-16 border-t border-[#EFEAD9]/10">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <Label n="07">Kontakt</Label>
        <h2 className="mt-4 font-display text-4xl md:text-6xl">Navštívte <span className="italic text-[#C4A667]">nás</span></h2>

        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="border border-[#EFEAD9]/12 bg-[#13211A] p-7">
              <div className="font-display text-2xl">{COMPANY.name}</div>
              <div className="mt-5 space-y-4 font-light">
                <div className="flex items-start gap-3.5">
                  <MapPin className="h-5 w-5 text-[#C4A667] shrink-0 mt-0.5" />
                  <span className="text-[#CFCBBA]">{COMPANY.street}, {COMPANY.zip}<br />{COMPANY.country}</span>
                </div>
                <a href={`tel:${COMPANY.phoneHref}`} className="flex items-center gap-3.5 text-[#CFCBBA] hover:text-[#C4A667] transition">
                  <Phone className="h-5 w-5 text-[#C4A667]" /> {COMPANY.phone}
                </a>
                {COMPANY.emails.map((em) => (
                  <a key={em} href={`mailto:${em}`} className="flex items-center gap-3.5 text-[#CFCBBA] hover:text-[#C4A667] transition">
                    <Mail className="h-5 w-5 text-[#C4A667]" /> {em}
                  </a>
                ))}
              </div>
              <a href={MAP_DIR} target="_blank" rel="noreferrer" className={btnGold + ' mt-6 w-full'}>
                <Navigation className="h-4 w-4" /> Navigovať k nám
              </a>
            </div>

            <div className="mt-6 border border-[#C4A667]/30 p-1.5 bg-[#13211A]">
              <iframe title="Mapa SICO Cars" src={MAP_EMBED} className="w-full h-[240px] border-0 grayscale contrast-110" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>

            <div className="mt-6 border border-[#EFEAD9]/12 bg-[#13211A] p-7">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] mb-4"><Clock className="h-4 w-4 text-[#C4A667]" /> Otváracie hodiny</div>
              {hours.map(([d, h]) => (
                <div key={d} className="flex justify-between border-b border-[#EFEAD9]/10 py-2.5 last:border-0 text-sm">
                  <span className="text-[#8C948A] uppercase tracking-wider">{d}</span><span className="text-[#EFEAD9]">{h}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="border border-[#C4A667]/30 bg-[#13211A] p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-[0.25em] text-[#8C948A]">Meno a priezvisko *</label>
                <Input value={form.name} onChange={set('name')} placeholder="Vaše meno" className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-[#8C948A]">Email</label>
                <Input type="email" value={form.email} onChange={set('email')} placeholder="email@..." className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-[#8C948A]">Telefón</label>
                <Input value={form.phone} onChange={set('phone')} placeholder="+421..." className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-[0.25em] text-[#8C948A]">Správa</label>
                <Textarea value={form.message} onChange={set('message')} rows={5} placeholder="O ktoré vozidlo máte záujem?" className={inputCls} />
              </div>
            </div>
            <button type="submit" disabled={loading} className={btnGold + ' mt-6 w-full !py-4 disabled:opacity-60'}>
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
    <footer className="py-14 border-t border-[#EFEAD9]/10 bg-[#0A140F]">
      <div className="container mx-auto px-5 md:px-8 lg:px-12">
        <div className="font-display text-[13vw] leading-[0.85] text-[#EFEAD9]">
          Sico<span className="italic text-[#C4A667]"> Cars</span>
        </div>
        <div className="mt-8 flex flex-col md:flex-row justify-between gap-4 border-t border-[#EFEAD9]/10 pt-6 text-[11px] uppercase tracking-[0.2em] text-[#8C948A]">
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
    { label: 'Rok', value: car.year },
    { label: 'Najazdené', value: kmLabel(car.mileage) },
    { label: 'Výkon', value: `${car.power} kW` },
    { label: 'Palivo', value: FUEL_LABEL[car.fuel] },
    { label: 'Prevodovka', value: car.transmission },
    { label: 'Karoséria', value: car.body },
  ]
  const inputCls = 'rounded-none border-[#EFEAD9]/20 bg-transparent text-[#EFEAD9] placeholder:text-[#5f665d] focus-visible:ring-[#C4A667]'
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-[#0E1A14] border-[#C4A667]/30 rounded-none max-h-[92vh] overflow-y-auto text-[#EFEAD9]">
        <div className="relative">
          <img src={media(images[img], 900, 560)} alt={car.name} className="w-full h-72 md:h-80 object-cover" />
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (<button key={i} onClick={() => setImg(i)} className={`h-1.5 rounded-full transition-all ${i === img ? 'w-7 bg-[#C4A667]' : 'w-1.5 bg-[#EFEAD9]/50'}`} />))}
            </div>
          )}
          <div className="absolute left-4 top-4 border border-[#C4A667]/60 bg-[#0E1A14]/70 text-[#C4A667] text-[10px] uppercase tracking-[0.2em] px-3 py-1">{FUEL_LABEL[car.fuel]}</div>
          {car.dph && <div className="absolute right-4 top-4 border border-[#EFEAD9]/25 bg-[#0E1A14]/70 text-[#EFEAD9]/80 text-[10px] uppercase tracking-[0.2em] px-3 py-1">Odpočet DPH</div>}
        </div>
        <div className="p-7">
          <DialogHeader>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#8C948A]">{car.brand} · {car.year}</div>
            <DialogTitle className="font-display text-3xl text-[#EFEAD9] font-medium">{car.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-2 font-display text-3xl text-[#C4A667]">{priceLabel(car)}{car.dph ? ' s DPH' : ''}</div>
          {monthlyFrom(car.price) && (
            <div className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-[#8C948A]">Financovanie od <span className="text-[#EFEAD9]">{eur(monthlyFrom(car.price))} €/mes</span> · 72 mesiacov</div>
          )}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 border-t border-l border-[#EFEAD9]/12">
            {specs.map((s) => (
              <div key={s.label} className="border-b border-r border-[#EFEAD9]/12 p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#8C948A]">{s.label}</div>
                <div className="mt-1.5 font-display text-base">{s.value}</div>
              </div>
            ))}
          </div>
          {car.youtube && (
            <a href={car.youtube} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] hover:text-[#C4A667] transition">
              <Youtube className="h-5 w-5 text-[#C4A667]" /> Pozrieť video vozidla
            </a>
          )}
          <div className="mt-7 border-t border-[#EFEAD9]/12 pt-6">
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
      </DialogContent>
    </Dialog>
  )
}
