export function buildWhatsAppUrl(phoneNumber: string, message: string) {
  const internationalNumber = phoneNumber.replace(/\D/g, '')

  if (!internationalNumber) {
    throw new Error('A valid seller WhatsApp number is required.')
  }

  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`
}
