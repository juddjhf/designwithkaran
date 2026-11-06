import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, enum: ['Logo Design', 'Branding', 'Poster Design', 'Social Media', 'Thumbnail', 'Banner', 'Advertisement'] },
  description: { type: String, trim: true, maxlength: 3000, default: '' },
  image: { url: { type: String, required: true }, publicId: String },
  type: { type: String, trim: true, maxlength: 100, default: 'Creative direction' },
  published: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true })

projectSchema.index({ published: 1, sortOrder: 1 })
export default mongoose.model('Project', projectSchema)
