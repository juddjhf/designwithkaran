import { randomBytes } from 'node:crypto'

export function generateOrderId() {
  return `DWK-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`
}
