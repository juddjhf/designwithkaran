import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  price: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  deliveryTime: { type: String, required: true, trim: true, maxlength: 80 },
  image: { url: String, publicId: String },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true })

serviceSchema.index({ active: 1, sortOrder: 1 })
export default mongoose.model('Service', serviceSchema)
