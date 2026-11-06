import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  role: { type: String, trim: true, maxlength: 120, default: '' },
  quote: { type: String, required: true, trim: true, maxlength: 1000 },
  published: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Testimonial', testimonialSchema)
