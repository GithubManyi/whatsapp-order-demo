import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl } from './whatsapp'

describe('buildWhatsAppUrl', () => {
  it('uses digits-only international number and preserves the prepared order text', () => {
    const message = 'Hello Store 👋\n\n2 × Classic Sneakers — KES 5,000'
    const url = buildWhatsAppUrl('+254 790-290-527', message)

    expect(url).toBe(
      `https://wa.me/254790290527?text=${encodeURIComponent(message)}`,
    )
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(message)
  })
})
