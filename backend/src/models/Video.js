import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, enum: ['Instagram Reels', 'Video Editing', 'Motion Graphics', 'Promotional Videos', 'YouTube Videos'] },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  thumbnail: { url: { type: String, required: true }, publicId: String },
  youtubeUrl: { type: String, trim: true, maxlength: 500, default: '' },
  instagramUrl: { type: String, trim: true, maxlength: 500, default: '' },
  published: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true })

videoSchema.index({ published: 1, sortOrder: 1 })
export default mongoose.model('Video', videoSchema)
