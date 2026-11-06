import Contact from '../models/Contact.js'
import Order from '../models/Order.js'
import Setting from '../models/Setting.js'
import { normalizeOrderStatus } from '../utils/orderStatus.js'

export async function getSettings(request, response) {
  const settings = await Setting.findOne({ key: 'site' }).lean()
  if (!settings) return response.json({ brandName: 'Design With Karan', instagramUrl: 'https://www.instagram.com/designwith.karan/', contactEmail: '', whatsappNumber: '' })
  response.json({
    brandName: settings.brandName,
    instagramUrl: settings.instagramUrl,
    contactEmail: settings.contactEmail,
    whatsappNumber: settings.whatsappNumber,
  })
}

export async function updateSettings(request, response) {
  const allowed = ['brandName', 'instagramUrl', 'contactEmail', 'whatsappNumber']
  const update = {}
  for (const field of allowed) if (request.body[field] !== undefined) update[field] = String(request.body[field]).trim()
  if (update.instagramUrl && !/^https:\/\/(www\.)?instagram\.com\//i.test(update.instagramUrl)) return response.status(400).json({ message: 'Enter a valid Instagram URL.' })
  if (update.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(update.contactEmail)) return response.status(400).json({ message: 'Enter a valid contact email.' })
  const settings = await Setting.findOneAndUpdate({ key: 'site' }, { $set: update, $unset: { upiId: 1, qrImage: 1 }, $setOnInsert: { key: 'site' } }, { upsert: true, new: true, runValidators: true, strict: false })
  response.json(settings)
}

export async function createContact(request, response) {
  const { name, email, phone = '', service = '', message } = request.body
  if (![name, email, message].every((value) => typeof value === 'string' && value.trim())) return response.status(400).json({ message: 'Name, email and message are required.' })
  if (typeof phone !== 'string' || typeof service !== 'string') return response.status(400).json({ message: 'Phone and service must be text values.' })
  if (name.length > 100 || email.length > 254 || phone.length > 20 || service.length > 120 || message.length > 3000) return response.status(400).json({ message: 'One or more fields exceed the allowed length.' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response.status(400).json({ message: 'Enter a valid email address.' })
  if (phone && !/^[+()0-9 .-]{7,20}$/.test(phone.trim())) return response.status(400).json({ message: 'Enter a valid phone number.' })
  const contact = await Contact.create({ name, email, phone, service, message })
  response.status(201).json({ message: 'Thanks for your message.', id: contact.id })
}

export async function listContacts(request, response) {
  response.json(await Contact.find().sort({ createdAt: -1 }).limit(300).lean())
}

export async function updateContact(request, response) {
  if (!['New', 'Read', 'Archived'].includes(request.body.status)) return response.status(400).json({ message: 'Invalid contact status.' })
  const contact = await Contact.findByIdAndUpdate(request.params.id, { status: request.body.status }, { new: true, runValidators: true })
  if (!contact) return response.status(404).json({ message: 'Contact not found.' })
  response.json(contact)
}

export async function overview(request, response) {
  const [totalOrders, newRequests, completedOrders, activeProjects, recentOrders] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: ['New Request', 'Pending Payment', 'Payment Submitted'] } }),
    Order.countDocuments({ status: 'Completed' }),
    Order.countDocuments({ status: 'In Progress' }),
    Order.find().select('orderId service serviceName customerName customerEmail customerPhone requirements references status createdAt updatedAt').sort({ createdAt: -1 }).limit(12).lean(),
  ])
  const safeRecentOrders = recentOrders.map((order) => ({ ...order, status: normalizeOrderStatus(order.status) }))
  response.json({ totalOrders, newRequests, completedOrders, activeProjects, recentOrders: safeRecentOrders })
}
