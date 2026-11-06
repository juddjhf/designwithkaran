import mongoose from 'mongoose'
import './env.js'

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI?.trim()
  const legacyMongoUri = process.env.MONGODB_URI?.trim()
  if (mongoUri && legacyMongoUri && mongoUri !== legacyMongoUri) {
    throw new Error('MONGO_URI and MONGODB_URI are both set but do not match.')
  }
  const uri = mongoUri || legacyMongoUri
  if (!uri) throw new Error('MONGO_URI is required.')
  let databaseName
  try {
    databaseName = decodeURIComponent(new URL(uri).pathname.slice(1).split('/')[0])
  } catch {
    throw new Error('MONGO_URI must be a valid MongoDB URI with a database name.')
  }
  if (!databaseName) throw new Error('MONGO_URI must include an explicit database name.')
  await mongoose.connect(uri)
  console.info(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`)
}
