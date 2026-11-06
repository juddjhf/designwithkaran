import multer from 'multer'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5, fields: 20, parts: 30 },
  fileFilter(request, file, callback) {
    if (!allowedTypes.has(file.mimetype)) {
      const error = new Error('Only JPEG, PNG, WebP images and PDF files are allowed.')
      error.statusCode = 400
      return callback(error)
    }
    callback(null, true)
  },
})

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 20, parts: 22 },
  fileFilter(request, file, callback) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      const error = new Error('Only JPEG, PNG and WebP images are allowed.')
      error.statusCode = 400
      return callback(error)
    }
    callback(null, true)
  },
})

function matchesFileSignature(file) {
  const bytes = file.buffer
  if (file.mimetype === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (file.mimetype === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (file.mimetype === 'image/webp') return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
  if (file.mimetype === 'application/pdf') return bytes.toString('ascii', 0, 5) === '%PDF-'
  return false
}

export function verifyUploadContent(request, response, next) {
  const files = [...(request.files || []), ...(request.file ? [request.file] : [])]
  if (files.some((file) => !matchesFileSignature(file))) return response.status(400).json({ message: 'An uploaded file does not match its declared file type.' })
  next()
}
