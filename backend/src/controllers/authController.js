import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import '../config/env.js'

export async function login(request, response) {
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : ''
  const password = request.body?.password
  if (!email || typeof password !== 'string' || password.length > 200) return response.status(400).json({ message: 'Email and password are required.' })
  const admin = await Admin.findOne({ email }).select('+password')
  if (!admin || !(await bcrypt.compare(password, admin.password))) return response.status(401).json({ message: 'Email or password is incorrect.' })
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return response.status(500).json({ message: 'Authentication is not configured correctly.' })
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { subject: admin.id, expiresIn: process.env.JWT_EXPIRES_IN || '8h' })
  response.json({ token, admin: { id: admin.id, email: admin.email } })
}
