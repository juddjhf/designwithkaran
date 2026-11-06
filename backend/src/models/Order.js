import mongoose from 'mongoose'
import { ORDER_STATUSES } from '../utils/orderStatus.js'

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceName: { type: String, required: true, trim: true },
  customerName: { type: String, required: true, trim: true, maxlength: 100 },
  customerEmail: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  customerPhone: { type: String, required: true, trim: true, maxlength: 20 },
  requirements: { type: String, required: true, trim: true, maxlength: 3000 },
  references: [{ url: String, publicId: String, originalName: String }],
  status: { type: String, enum: ORDER_STATUSES, default: 'New Request', index: true },
  accessTokenHash: { type: String, required: true, select: false },
}, { timestamps: true })

orderSchema.index({ createdAt: -1 })
export default mongoose.model('Order', orderSchema)
