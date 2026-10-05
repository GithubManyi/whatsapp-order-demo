export type Product = {
  id: number
  name: string
  price: number
  image: string
}

export const storeConfig = {
  name: 'My Store',
  tagline: 'Order easily through WhatsApp',
  whatsapp: '254790290527',
  products: [
    { id: 1, name: 'Classic Sneakers', price: 2500, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Black Hoodie', price: 1800, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Leather Handbag', price: 3200, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Classic Watch', price: 3500, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { id: 5, name: 'Sunglasses', price: 1200, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80' },
    { id: 6, name: 'Casual T-Shirt', price: 950, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
  ] satisfies Product[],
}
