import test from 'node:test'
import assert from 'node:assert/strict'
import { createOrder } from '../src/controllers/orderController.js'
import Order from '../src/models/Order.js'
import Setting from '../src/models/Setting.js'
import Service from '../src/models/Service.js'
import router from '../src/routes/index.js'
import { generateOrderId } from '../src/utils/generateOrderId.js'
import { normalizeOrderStatus, ORDER_STATUSES } from '../src/utils/orderStatus.js'

test('order IDs use the brand prefix, current year and a unique random suffix', () => {
  const first = generateOrderId()
  const second = generateOrderId()
  assert.match(first, /^DWK-\d{4}-[A-F0-9]{8}$/)
  assert.notEqual(first, second)
})

test('new orders use the payment-free request lifecycle', () => {
  assert.deepEqual(ORDER_STATUSES, ['New Request', 'Accepted', 'In Progress', 'Revision', 'Completed', 'Cancelled'])
  assert.deepEqual(Order.schema.path('status').enumValues, ORDER_STATUSES)
  assert.equal(new Order({}).status, 'New Request')
  for (const field of ['price', 'paymentMethod', 'paymentStatus', 'paymentScreenshot', 'transactionId', 'utr']) {
    assert.equal(Order.schema.path(field), undefined)
  }
})

test('legacy payment order states are presented as request states', () => {
  assert.equal(normalizeOrderStatus('Pending Payment'), 'New Request')
  assert.equal(normalizeOrderStatus('Payment Submitted'), 'New Request')
  assert.equal(normalizeOrderStatus('Payment Verified'), 'Accepted')
  assert.equal(normalizeOrderStatus('In Progress'), 'In Progress')
})

test('order submission persists and returns a request without payment amounts', async (t) => {
  const originalFindOne = Service.findOne
  const originalCreate = Order.create
  let savedOrder
  Service.findOne = async () => ({ _id: '507f1f77bcf86cd799439011', title: 'Brand identity', price: 2499 })
  Order.create = async (values) => {
    savedOrder = values
    return { ...values, status: 'New Request' }
  }
  t.after(() => {
    Service.findOne = originalFindOne
    Order.create = originalCreate
  })

  const response = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this },
    json(body) { this.body = body; return this },
  }
  await createOrder({
    body: {
      customerName: 'Alex Customer',
      customerEmail: 'alex@example.com',
      customerPhone: '+91 98765 43210',
      requirements: 'A new visual identity for my business.',
      serviceId: '507f1f77bcf86cd799439011',
    },
    files: [],
  }, response)

  assert.equal(response.statusCode, 201)
  assert.equal(response.body.order.status, 'New Request')
  assert.equal(response.body.order.serviceName, 'Brand identity')
  assert.equal(savedOrder.customerEmail, 'alex@example.com')
  assert.equal(savedOrder.requirements, 'A new visual identity for my business.')
  assert.equal(Object.hasOwn(savedOrder, 'price'), false)
  assert.equal(new Order(savedOrder).validateSync(), undefined)
})

test('payment API routes and payment-only setting fields are removed', () => {
  const paths = router.stack.filter((layer) => layer.route).map((layer) => layer.route.path)
  assert.ok(paths.includes('/orders'))
  assert.ok(paths.includes('/orders/:orderId/status'))
  assert.equal(paths.some((path) => path.startsWith('/payments')), false)
  assert.equal(Setting.schema.path('upiId'), undefined)
  assert.equal(Setting.schema.path('qrImage'), undefined)
})
