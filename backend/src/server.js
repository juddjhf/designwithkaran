import './config/env.js'
import app from './app.js'
import { connectDatabase } from './config/db.js'

const port = Number(process.env.PORT) || 5000

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set to a random value of at least 32 characters.')
  process.exit(1)
}

try {
  await connectDatabase()
  app.listen(port, () => console.info(`Design With Karan API listening on port ${port}`))
} catch (error) {
  console.error('API startup failed:', error.message)
  process.exit(1)
}
