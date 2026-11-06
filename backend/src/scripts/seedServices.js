import 'dotenv/config'
import { connectDatabase } from '../config/db.js'
import Service from '../models/Service.js'

const demoServices = [
  { title: 'Logo design', slug: 'logo-design', description: 'A distinct mark and thoughtful logo suite that gives your brand a confident start.', price: 2499, deliveryTime: '3–5 days', image: { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85' } },
  { title: 'Social media kit', slug: 'social-media-kit', description: 'Scroll-stopping creative, designed as a consistent system for your social channels.', price: 1799, deliveryTime: '2–4 days', image: { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85' } },
  { title: 'Poster design', slug: 'poster-design', description: 'Campaign-ready poster artwork with a strong idea and a polished finish.', price: 1499, deliveryTime: '2–3 days', image: { url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85' } },
  { title: 'YouTube thumbnail', slug: 'youtube-thumbnail', description: 'One custom thumbnail built to stand out in a crowded feed.', price: 799, deliveryTime: '1–2 days', image: { url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=900&q=85' } },
]

try {
  await connectDatabase()
  if (await Service.exists({})) {
    console.info('Services already exist; no demo services were inserted.')
  } else {
    await Service.insertMany(demoServices)
    console.info(`Added ${demoServices.length} editable demo services. Review their titles, prices and details in the admin dashboard.`)
  }
} catch (error) {
  console.error('Service setup failed:', error.message)
  process.exitCode = 1
} finally {
  const mongoose = await import('mongoose')
  await mongoose.default.disconnect()
}
