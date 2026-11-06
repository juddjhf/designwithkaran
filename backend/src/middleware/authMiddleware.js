import jwt from 'jsonwebtoken'

export function requireAdmin(request, response, next) {
  const token = request.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return response.status(401).json({ message: 'Admin authentication is required.' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (payload.role !== 'admin' || !payload.sub) return response.status(401).json({ message: 'Invalid admin token.' })
    request.adminId = payload.sub
    next()
  } catch {
    response.status(401).json({ message: 'Admin session is invalid or expired.' })
  }
}
