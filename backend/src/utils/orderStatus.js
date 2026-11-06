export const ORDER_STATUSES = Object.freeze([
  'New Request',
  'Accepted',
  'In Progress',
  'Revision',
  'Completed',
  'Cancelled',
])

const legacyStatuses = new Map([
  ['Pending Payment', 'New Request'],
  ['Payment Submitted', 'New Request'],
  ['Payment Verified', 'Accepted'],
])

export function normalizeOrderStatus(status) {
  return legacyStatuses.get(status) || status
}
