
import '../config/env.js'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDatabase } from '../config/db.js'
import Admin from '../models/Admin.js'

const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env
const email = typeof ADMIN_EMAIL === 'string' ? ADMIN_EMAIL.trim().toLowerCase() : ''

if (
  !email ||
  !ADMIN_PASSWORD ||
  ADMIN_PASSWORD.length < 12 ||
  !JWT_SECRET ||
  JWT_SECRET.length < 32
) {
  console.error('Check ADMIN_EMAIL, ADMIN_PASSWORD and JWT_SECRET in backend/.env.')
  process.exit(1)
}

let connected = false
try {
  await connectDatabase()
  connected = true
  const admin = await Admin.findOne({ email })

  if (!admin) {
    console.error('Admin account not found. No account was changed; run npm run seed:admin to create it.')
    process.exitCode = 1
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)
    admin.password = hashedPassword
    await admin.save()
    console.info('Admin password reset successfully.')
  }
} catch (error) {
  console.error('Password reset failed:', error.message)
  process.exitCode = 1
} finally {
  if (connected) await mongoose.disconnect()
}
