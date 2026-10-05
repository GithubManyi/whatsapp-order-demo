export type IntakeProduct = { name: string; price: string }

export type SellerIntake = {
  sellerName: string
  businessName: string
  businessWhatsApp: string
  tagline: string
  products: IntakeProduct[]
}

export const MAX_INTAKE_PRODUCTS = 10

export function buildSellerIntakeMessage(intake: SellerIntake) {
  const products = intake.products
    .filter((product) => product.name.trim() && product.price.trim())
    .map((product, index) => `${index + 1}. ${product.name.trim()} - KES ${Number(product.price).toLocaleString()}`)

  return [
    'NEW STORE REQUEST',
    '',
    `Business: ${intake.businessName.trim()}`,
    `Seller: ${intake.sellerName.trim()}`,
    `Business WhatsApp: ${intake.businessWhatsApp.trim()}`,
    `Tagline: ${intake.tagline.trim()}`,
    '',
    'Products:',
    ...products,
    '',
    'I will send the matching product photos in this WhatsApp chat next.',
  ].join('\n')
}
