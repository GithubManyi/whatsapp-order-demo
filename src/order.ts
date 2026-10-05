type OrderItem = { quantity: number; name: string; lineTotal: number }
type Customer = { name: string; location: string; note?: string }

type OrderMessageInput = {
  storeName: string
  items: OrderItem[]
  total: number
  customer: Customer
}

export function buildOrderMessage({ storeName, items, total, customer }: OrderMessageInput) {
  const orderLines = items.map(
    (item) => `${item.quantity} x ${item.name} - KES ${item.lineTotal.toLocaleString()}`,
  )

  return [
    `Hello ${storeName}`,
    `I'd like to place an order:`,
    '',
    ...orderLines,
    '',
    `Total: KES ${total.toLocaleString()}`,
    '',
    `Name: ${customer.name.trim()}`,
    `Delivery: ${customer.location.trim()}`,
    ...(customer.note?.trim() ? [`Note: ${customer.note.trim()}`] : []),
    '',
    'Sent from your online order page.',
  ].join('\n')
}
