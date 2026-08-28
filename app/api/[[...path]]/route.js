import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// ---- SICO Cars seed inventory (from sicocars.sk) ----
const SEED_CARS = [
  { brand: 'Audi', name: 'A6 Allroad 3.0 V6 quattro', fuel: 'diesel', power: 180, transmission: '7-st. automat (S-tronic)', year: '06/2012', mileage: 224704, price: 13490, dph: false, featured: false, youtube: 'https://youtu.be/sEi5SIQH4_A', body: 'Kombi', image: 'e394d7_3128055964874adda79f61c0dc8061d8~mv2.jpg', image2: 'e394d7_6eb75dc36f02486dbce0adc90e5f2a09~mv2.jpg' },
  { brand: 'Audi', name: 'A7 3.0 V6 quattro Sportback Prestige', fuel: 'diesel', power: 180, transmission: '7-st. automat (S-tronic)', year: '03/2012', mileage: 224210, price: 14490, dph: false, featured: true, youtube: 'https://youtu.be/HloMti1EO4U', body: 'Sportback', image: 'e394d7_7c4972f0f1774a9fa3723685f3b123f2~mv2.jpg', image2: 'e394d7_f8625cc39a1843df9dc89f6bb05b02eb~mv2.jpg' },
  { brand: 'Toyota', name: 'Yaris 1.5 Hybrid Comfort +', fuel: 'hybrid', power: 74, transmission: 'variabilná automat', year: '2020', mileage: 108807, price: 12490, dph: false, featured: false, youtube: 'https://youtu.be/NCY90e0bnuA', body: 'Hatchback', image: 'e394d7_0009432111074ec89590758bbb2a1bf9~mv2.jpg', image2: 'e394d7_0475ca73888c4f7581861a83bacc8403~mv2.jpg' },
  { brand: 'KIA', name: 'Niro EV 64kW Executive Line', fuel: 'elektro', power: 150, transmission: '1-st. automat', year: '09/2020', mileage: 140326, price: 19990, dph: true, featured: true, youtube: 'https://youtu.be/hKaMz7e1b0M', body: 'SUV', image: 'e394d7_8b70331ad2e646ea80bb0602bd72a391~mv2.jpg', image2: 'e394d7_743f18e6cdce48169d71c7280a8155f8~mv2.jpg' },
  { brand: 'Ford', name: 'Grand C-MAX 1.0 EcoBoost', fuel: 'benzín', power: 92, transmission: '6-st. manuál', year: '2016', mileage: 83703, price: 7990, dph: false, featured: false, youtube: 'https://youtu.be/qkakhAOoU6s', body: 'MPV', image: 'e394d7_d076d6d757db4cd297d3a062852706a1~mv2.jpg', image2: 'e394d7_42533ca5f5214c98992bca8ccb9e9cb4~mv2.jpg' },
  { brand: 'Mitsubishi', name: 'ASX 1.8 DI-D Invite', fuel: 'diesel', power: 110, transmission: '6-st. manuál', year: '2011', mileage: 234064, price: 4490, dph: false, featured: false, youtube: 'https://youtu.be/JGLtc5bYSIg', body: 'SUV', image: 'e394d7_d1019b4ccaa14651afac91f7d71a732d~mv2.jpg', image2: 'e394d7_6dc3bb9cb9ca4e9db2155058e02308e6~mv2.jpg' },
  { brand: 'KIA', name: 'e-Soul Electric Edition', fuel: 'elektro', power: 100, transmission: '1-st. automat', year: '2022', mileage: 19242, price: 17990, dph: true, featured: true, youtube: 'https://youtu.be/T9f1ELTnHzc', body: 'SUV', image: 'e394d7_7762351de5f34504a4f73ec8d4e7e79a~mv2.jpg', image2: 'e394d7_758d5175c1ec41158e00deb6ecea9d88~mv2.jpg' },
  { brand: 'BMW', name: '520d F11 Touring', fuel: 'diesel', power: 135, transmission: '8-st. automat', year: '10/2011', mileage: 186414, price: 10690, dph: false, featured: false, youtube: 'https://youtu.be/3pK92UHok3g', body: 'Kombi', image: 'e394d7_6c00bcf0fe4a400b863155a36db53fd8~mv2.jpg', image2: 'e394d7_e1dc1baf97e04d77a66afecfc3a270ac~mv2.jpg' },
  { brand: 'Škoda', name: 'Superb Combi 2.0 TDI Style', fuel: 'diesel', power: 110, transmission: '6-st. manuál', year: '2016', mileage: 219539, price: 11990, dph: false, featured: true, youtube: 'https://youtu.be/nSOBvSn1F2I', body: 'Kombi', image: 'e394d7_d7c98e0f33164a44a3e6a42ff4539489~mv2.jpg', image2: 'e394d7_70488f8b62324f05b7da6ea4dc9f6f51~mv2.jpg' },
  { brand: 'Ford', name: 'EcoSport 1.5 TDCi Titanium', fuel: 'diesel', power: 66, transmission: '5-st. manuál', year: '2015', mileage: 58911, price: 8990, dph: false, featured: false, youtube: 'https://youtu.be/WkHwbTcAHiQ', body: 'SUV', image: 'e394d7_bc1907d832014c618450e1a67bf92428~mv2.jpg', image2: 'e394d7_90c41d93956748cb9814b3a3921fc5bf~mv2.jpg' },
  { brand: 'Suzuki', name: 'Vitara 1.6 VVT', fuel: 'benzín', power: 88, transmission: '5-st. manuál', year: '04/2015', mileage: 116734, price: null, dph: false, featured: false, youtube: null, body: 'SUV', image: 'e394d7_cfc177e89cc8491ba411070b230f9f1b~mv2.jpg', image2: 'e394d7_e4d57928c22641c1adb905aef878a481~mv2.jpg' },
  { brand: 'Audi', name: 'A3 Sportback 1.4 TFSI e-tron', fuel: 'hybrid', power: 150, transmission: '6-st. automat', year: '01/2018', mileage: 129714, price: null, dph: false, featured: false, youtube: null, body: 'Hatchback', image: 'e394d7_e73d3b1a9f724ea3a8a93c65ecda2c85~mv2.jpg', image2: 'e394d7_8650e80320a54bac8f07ccbf36c63b6e~mv2.jpg' },
  { brand: 'Dongfeng', name: 'SERES 3 EV', fuel: 'elektro', power: 120, transmission: '1-st. automat', year: '06/2025', mileage: 96, price: null, dph: true, featured: true, youtube: null, body: 'SUV', image: 'e394d7_c1faf8b919844217af5b6ba5c7f942fd~mv2.jpg', image2: 'e394d7_d2f24dbd60a7414cb09ac1e5f6ac61f0~mv2.jpg' },
  { brand: 'Audi', name: 'e-tron 50 quattro Mythos Black', fuel: 'elektro', power: 230, transmission: '1-st. automat', year: '09/2021', mileage: 170906, price: null, dph: true, featured: true, youtube: null, body: 'SUV', image: 'e394d7_cbd3feaa00e24a9ca16da73e7dfa8f58~mv2.jpg', image2: 'e394d7_08cca89ebce84a61a222faf827a5b3fd~mv2.jpg' },
  { brand: 'Fiat', name: '500X Cross 1.6', fuel: 'benzín', power: 81, transmission: '6-st. manuál', year: '04/2017', mileage: 117876, price: null, dph: false, featured: false, youtube: null, body: 'SUV', image: 'e394d7_4db041a52ef64dc497aa5bdcc20e387b~mv2.jpg', image2: 'e394d7_9f1c84be3b1648c28d29bd5ca93ac787~mv2.jpg' },
  { brand: 'Volkswagen', name: 'Golf 2.0 TDI Alltrack 4x4', fuel: 'diesel', power: 135, transmission: '6-st. automat', year: '01/2017', mileage: 156005, price: null, dph: false, featured: false, youtube: null, body: 'Kombi', image: 'e394d7_ee93ffc37499411d83b8ca3c7a3fc079~mv2.jpg', image2: 'e394d7_c5a7da3e5c504b9ab365d6aae3e86f17~mv2.jpg' },
  { brand: 'Audi', name: 'A6 Avant 3.0 TDI V6 quattro Webasto', fuel: 'diesel', power: 160, transmission: '7-st. automat (S-tronic)', year: '2016', mileage: 198073, price: null, dph: false, featured: false, youtube: null, body: 'Kombi', image: 'e394d7_a6d6d8af203a4481ba4a7d1d06fd77a9~mv2.jpg', image2: 'e394d7_1a5d6aeb8de94ad095fdc1ac1b13a7c9~mv2.jpg' },
  { brand: 'Hyundai', name: 'Kona Electric 100 kW', fuel: 'elektro', power: 100, transmission: '1-st. automat', year: '2023', mileage: 9476, price: null, dph: true, featured: true, youtube: null, body: 'SUV', image: 'e394d7_f93cc770d94345ccb236f6234ec4a419~mv2.jpg', image2: 'e394d7_8ef8437ac76b49abbac8bb1311a100b9~mv2.jpg' },
  { brand: 'Opel', name: 'Grandland 1.2 Innovation Exclusive', fuel: 'benzín', power: 96, transmission: '6-st. automat', year: '05/2018', mileage: 125524, price: null, dph: false, featured: false, youtube: null, body: 'SUV', image: 'e394d7_f7be2f5da5f349d09ce368abd90ff2d2~mv2.jpg', image2: 'e394d7_5dac14e2b2534ffbbc3a06dc0f5136e8~mv2.jpg' },
  { brand: 'Hyundai', name: 'Ioniq Electric 100 kW', fuel: 'elektro', power: 100, transmission: '1-st. automat', year: '2022', mileage: 70853, price: null, dph: true, featured: false, youtube: null, body: 'Hatchback', image: 'e394d7_c301c2a2dfb84f39bf4bd76f2e36baf1~mv2.jpg', image2: 'e394d7_e18c4baeaa9d4be1a1da93030368ac53~mv2.jpg' },
  { brand: 'Audi', name: 'A6 Ultra Limousine 2.0 TDI Design Selection', fuel: 'diesel', power: 140, transmission: '7-st. automat (S-tronic)', year: '2016', mileage: 181952, price: null, dph: false, featured: true, youtube: null, body: 'Limuzína', image: 'e394d7_0b0e975a92a34b4c82e60e308f64cc11~mv2.jpg', image2: 'e394d7_26fbb1b8087c4b639c130c837c880f8a~mv2.jpg' },
  { brand: 'Škoda', name: 'Octavia II Combi 1.4 TSI', fuel: 'benzín', power: 90, transmission: '6-st. manuál', year: '2009', mileage: 182611, price: null, dph: false, featured: false, youtube: null, body: 'Kombi', image: 'e394d7_7a067882a8d14dbeb0fd19662228d931~mv2.jpg', image2: 'e394d7_45bbbc5a6e8a48bfa138adecafcdb5b4~mv2.jpg' },
  { brand: 'Škoda', name: 'Octavia IV 2.0 TDI Style + Tech', fuel: 'diesel', power: 85, transmission: '6-st. manuál', year: '07/2021', mileage: 138795, price: null, dph: false, featured: false, youtube: null, body: 'Liftback', image: 'e394d7_3f9e3889416a41a1a52e04dc816ed4e0~mv2.jpg', image2: 'e394d7_fcc320eb805a4a0284f3f0bf75e1bac0~mv2.jpg' },
  { brand: 'Audi', name: 'e-tron 50 quattro Daytona Grey', fuel: 'elektro', power: 230, transmission: '1-st. automat', year: '2020', mileage: 173638, price: null, dph: true, featured: false, youtube: null, body: 'SUV', image: 'e394d7_3c14ab7d3bd34d5295bf77a6a473adee~mv2.jpg', image2: 'e394d7_850801bd1d044131993251bd5b98d2f1~mv2.jpg' },
  { brand: 'Opel', name: 'Antara 2.2 CDTI 4x4 Cosmo', fuel: 'diesel', power: 135, transmission: '6-st. manuál', year: '2012', mileage: 176666, price: null, dph: false, featured: false, youtube: null, body: 'SUV', image: 'e394d7_fea25269f12747009ff153542d18f977~mv2.jpg', image2: 'e394d7_763048f97a0e4b159d79b3e8a6444568~mv2.jpg' },
  { brand: 'Peugeot', name: '308 SW 1.5 Blue-HDi Style', fuel: 'diesel', power: 96, transmission: '6-st. automat', year: '07/2019', mileage: 138871, price: null, dph: true, featured: false, youtube: null, body: 'Kombi', image: 'e394d7_e8f93f4ea9fc498ead42eb9f56f59b14~mv2.jpg', image2: 'e394d7_54d7dd87d5ab43af81902ab2dc3dfa93~mv2.jpg' },
  { brand: 'Škoda', name: 'Rapid 1.0 TSI Style+ Edition', fuel: 'benzín', power: 70, transmission: '5-st. manuál', year: '2018', mileage: 58461, price: null, dph: false, featured: false, youtube: null, body: 'Liftback', image: 'e394d7_7f4dc204dbff43f29c8a5f0d102dd294~mv2.jpg', image2: 'e394d7_c42d890683dc4c7c899c0205fcaee8a8~mv2.jpg' },
  { brand: 'Audi', name: 'Q5 2.0 TFSI quattro S line', fuel: 'benzín', power: 155, transmission: '7-st. automat', year: '2011', mileage: 221535, price: null, dph: false, featured: false, youtube: null, body: 'SUV', image: 'e394d7_36a31b43659e445a92ee3c80d19adf1c~mv2.jpg', image2: 'e394d7_8302c28c163c41e7b279ab0fb9c54654~mv2.jpg' },
  { brand: 'Nissan', name: 'Qashqai 1.6 dCi 4x4 Premier', fuel: 'diesel', power: 96, transmission: '6-st. manuál', year: '2015', mileage: 152282, price: null, dph: false, featured: false, youtube: null, body: 'SUV', image: 'e394d7_f15d472d1a2a4a52a6da7d8de5fc34e8~mv2.jpg', image2: 'e394d7_8e22bb54b7804357bc85d68c0260bd8d~mv2.jpg' },
  { brand: 'Volkswagen', name: 'Golf 1.4 TSI Comfortline', fuel: 'benzín', power: 92, transmission: '6-st. automat', year: '07/2015', mileage: 185723, price: null, dph: false, featured: false, youtube: null, body: 'Hatchback', image: 'e394d7_d0de05048959426bac3fb41c77c29ab7~mv2.jpg', image2: 'e394d7_e94ab2c6c808466f89eb78c8b69f67ef~mv2.jpg' },
]

async function ensureSeed(db) {
  const count = await db.collection('cars').countDocuments()
  if (count === 0) {
    const docs = SEED_CARS.map((c, i) => ({ id: uuidv4(), order: i, createdAt: new Date(), ...c }))
    await db.collection('cars').insertMany(docs)
  }
}

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'SICO Cars API' }))
    }

    // List all cars (seed if empty)
    if (route === '/cars' && method === 'GET') {
      await ensureSeed(db)
      const cars = await db.collection('cars').find({}).sort({ order: 1 }).toArray()
      const cleaned = cars.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleaned))
    }

    // Single car
    if (route.startsWith('/cars/') && method === 'GET') {
      const id = path[1]
      const car = await db.collection('cars').findOne({ id })
      if (!car) return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
      const { _id, ...rest } = car
      return handleCORS(NextResponse.json(rest))
    }

    // Reseed helper (force refresh inventory)
    if (route === '/cars/reseed' && method === 'POST') {
      await db.collection('cars').deleteMany({})
      await ensureSeed(db)
      const cars = await db.collection('cars').find({}).sort({ order: 1 }).toArray()
      return handleCORS(NextResponse.json({ seeded: cars.length }))
    }

    // Create inquiry
    if (route === '/inquiries' && method === 'POST') {
      const body = await request.json()
      if (!body.name || (!body.email && !body.phone)) {
        return handleCORS(NextResponse.json({ error: 'Meno a kontakt sú povinné' }, { status: 400 }))
      }
      const inquiry = {
        id: uuidv4(),
        name: body.name,
        email: body.email || '',
        phone: body.phone || '',
        message: body.message || '',
        carId: body.carId || null,
        carName: body.carName || null,
        type: body.type || 'general',
        createdAt: new Date(),
      }
      await db.collection('inquiries').insertOne(inquiry)
      const { _id, ...rest } = inquiry
      return handleCORS(NextResponse.json(rest, { status: 201 }))
    }

    if (route === '/inquiries' && method === 'GET') {
      const items = await db.collection('inquiries').find({}).sort({ createdAt: -1 }).limit(500).toArray()
      const cleaned = items.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleaned))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
