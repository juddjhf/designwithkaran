import { createHash, randomBytes } from 'node:crypto'
import Order from '../models/Order.js'
import Service from '../models/Service.js'
import { uploadBuffer } from '../config/cloudinary.js'
import { generateOrderId } from '../utils/generateOrderId.js'
import { ORDER_STATUSES, normalizeOrderStatus } from '../utils/orderStatus.js'

const tokenHash = (value) => createHash('sha256').update(value).digest('hex')
const orderFields = ['_id', 'orderId', 'service', 'serviceName', 'customerName', 'customerEmail', 'customerPhone', 'requirements', 'references', 'status', 'createdAt', 'updatedAt']
const safeOrder = (order) => Object.fromEntries(orderFields.filter((field) => order[field] !== undefined).map((field) => [field, field === 'status' ? normalizeOrderStatus(order[field]) : order[field]]))

export async function createOrder(request, response) {
  const { customerName, customerEmail, customerPhone, requirements, serviceId } = request.body
  if (![customerName, customerEmail, customerPhone, requirements, serviceId].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ message: 'Name, email, phone, service and project requirements are required.' })
  }
  if (customerName.trim().length > 100 || customerEmail.trim().length > 254 || customerPhone.trim().length > 20 || requirements.trim().length > 3000) {
    return response.status(400).json({ message: 'One or more booking fields exceed the allowed length.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) return response.status(400).json({ message: 'Enter a valid email address.' })
  if (!/^[+()0-9 .-]{7,20}$/.test(customerPhone.trim())) return response.status(400).json({ message: 'Enter a valid phone number.' })
  const service = await Service.findOne({ _id: serviceId, active: true })
  if (!service) return response.status(404).json({ message: 'The selected service is unavailable.' })
  const accessToken = randomBytes(32).toString('hex')
  const references = []
  for (const file of request.files || []) {
    const media = await uploadBuffer(file.buffer, { folder: 'order-references' })
    references.push({ ...media, originalName: file.originalname.slice(0, 180) })
  }
  const order = await Order.create({
    orderId: generateOrderId(),
    service: service._id,
    serviceName: service.title,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    customerPhone: customerPhone.trim(),
    requirements: requirements.trim(),
    references,
    accessTokenHash: tokenHash(accessToken),
  })
  response.status(201).json({ order: { orderId: order.orderId, serviceName: order.serviceName, status: order.status }, accessToken })
}

export async function getCustomerOrder(request, response) {
  const token = request.get('X-Order-Access')
  if (!token || token.length > 200) return response.status(401).json({ message: 'Order access token is required.' })
  const order = await Order.findOne({ orderId: request.params.orderId }).select('+accessTokenHash')
  if (!order || order.accessTokenHash !== tokenHash(token)) return response.status(404).json({ message: 'Order was not found or the access link is invalid.' })
  response.json({
    orderId: order.orderId,
    serviceName: order.serviceName,
    status: normalizeOrderStatus(order.status),
    createdAt: order.createdAt,
  })
}

export async function listOrders(request, response) {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(250).lean()
  response.json(orders.map(safeOrder))
}

export async function updateOrderStatus(request, response) {
  const { status } = request.body
  if (!ORDER_STATUSES.includes(status)) return response.status(400).json({ message: 'Invalid order status.' })
  const order = await Order.findOne({ orderId: request.params.orderId })
  if (!order) return response.status(404).json({ message: 'Order not found.' })
  order.status = status
  await order.save()
  response.json({ orderId: order.orderId, status: order.status })
}

export async function orderDetailsAdmin(request, response) {
  const order = await Order.findOne({ orderId: request.params.orderId }).populate('service', 'title').lean()
  if (!order) return response.status(404).json({ message: 'Order not found.' })
  response.json(safeOrder(order))
}
