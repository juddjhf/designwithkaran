import { v2 as cloudinary } from 'cloudinary'

const credentials = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
export const cloudinaryConfigured = credentials.every((key) => Boolean(process.env[key]))

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export function uploadBuffer(buffer, { folder, resource_type = 'image' } = {}) {
  if (!cloudinaryConfigured) throw new Error('Cloudinary is not configured. Set its credentials before uploading media.')
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: `design-with-karan/${folder || 'uploads'}`, resource_type }, (error, result) => {
      if (error) return reject(error)
      resolve({ url: result.secure_url, publicId: result.public_id, resourceType: result.resource_type })
    })
    stream.end(buffer)
  })
}
