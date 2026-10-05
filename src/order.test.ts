import { describe, expect, it } from 'vitest'
import { buildOrderMessage } from './order'

describe('buildOrderMessage', () => {
  it('contains only the products selected for the current order', () => {
    const message = buildOrderMessage({
      storeName: 'My Store',
      items: [{ quantity: 1, name: 'Black Hoodie', lineTotal: 1800 }],
      total: 1800,
      customer: { name: 'Mary Mwangi', location: 'Ruiru', note: 'Black' },
    })

    expect(message).toContain('1 x Black Hoodie - KES 1,800')
    expect(message).not.toContain('Leather Handbag')
    expect(message).not.toContain('Classic Sneakers')
    expect(message.match(/Sent from your online order page\./g)).toHaveLength(1)
  })
})
