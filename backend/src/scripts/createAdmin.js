import '../config/env.js'
import bcrypt from 'bcryptjs'
import { connectDatabase } from '../config/db.js'
import Admin from '../models/Admin.js'

const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env
const email = typeof ADMIN_EMAIL === 'string' ? ADMIN_EMAIL.trim().toLowerCase() : ''
if (!email || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12 || !JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('Set ADMIN_EMAIL, a 12+ character ADMIN_PASSWORD, and a 32+ character JWT_SECRET in backend/.env.')
  process.exit(1)
}

let connected = false
try {
  await connectDatabase()
  connected = true
  if (await Admin.exists({ email })) {
    console.info('Admin account already exists. No account was changed.')
  } else {
    const password = await bcrypt.hash(ADMIN_PASSWORD, 12)
    await Admin.create({ email, password })
    console.info('Admin account created successfully.')
  }
} catch (error) {
  if (error.code === 11000) {
    console.info('Admin account already exists. No account was changed.')
  } else {
    console.error('Admin setup failed:', error.message)
    process.exitCode = 1
  }
} finally {
  if (connected) {
    const mongoose = await import('mongoose')
    await mongoose.default.disconnect()
  }
}
