export function errorMiddleware(error, request, response, next) {
  if (response.headersSent) return next(error)
  if (error.name === 'ValidationError') {
    return response.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(' ') })
  }
  if (error.name === 'CastError') return response.status(400).json({ message: 'Invalid resource identifier.' })
  if (error.code === 11000) return response.status(409).json({ message: 'That value is already in use.' })
  if (error.name === 'MulterError') {
    const message = error.code === 'LIMIT_FILE_SIZE' ? 'Each file must be 5 MB or smaller.' : 'The uploaded files exceed the allowed limits.'
    return response.status(400).json({ message })
  }
  const status = Number(error.statusCode || error.status) || 500
  if (status >= 500) console.error(error)
  response.status(status).json({ message: status >= 500 ? 'An unexpected server error occurred.' : error.message })
}
