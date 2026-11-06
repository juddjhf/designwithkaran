import './config/env.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorMiddleware } from './middleware/errorMiddleware.js'
import apiRoutes from './routes/index.js'

const app = express()
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((origin) => origin.trim()).filter(Boolean)

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  origin(origin, callback) {
    if (!origin || origins.includes(origin)) return callback(null, true)
    const error = new Error('This origin is not allowed by the server.')
    error.statusCode = 403
    callback(error)
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Order-Access'],
}))
app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: false, limit: '100kb' }))
app.get('/api/health', (request, response) => response.json({ status: 'ok' }))
app.use('/api', apiRoutes)
app.use((request, response) => response.status(404).json({ message: 'API route not found.' }))
app.use(errorMiddleware)

export default app
