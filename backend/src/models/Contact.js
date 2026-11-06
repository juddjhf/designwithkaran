import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 20, default: '' },
  service: { type: String, trim: true, maxlength: 120, default: '' },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  status: { type: String, enum: ['New', 'Read', 'Archived'], default: 'New' },
}, { timestamps: true })

contactSchema.index({ createdAt: -1 })
export default mongoose.model('Contact', contactSchema)
