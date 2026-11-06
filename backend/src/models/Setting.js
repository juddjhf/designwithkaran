import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema({
  key: { type: String, default: 'site', unique: true },
  brandName: { type: String, default: 'Design With Karan', maxlength: 100 },
  instagramUrl: { type: String, default: 'https://www.instagram.com/designwith.karan/', maxlength: 500 },
  contactEmail: { type: String, default: '', maxlength: 254 },
  whatsappNumber: { type: String, default: '', maxlength: 30 },
}, { timestamps: true })

export default mongoose.model('Setting', settingSchema)
