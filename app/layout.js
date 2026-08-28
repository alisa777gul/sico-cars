import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'SICO Cars — rozumieme autám',
  description: 'Predaj a výkup áut · Individuálny dovoz · Komisionálny predaj · Financovanie a leasing · Poistenie vozidiel · Profesionálny Chip-Tuning. Certifikované vozidlá s overenými kilometrami.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
