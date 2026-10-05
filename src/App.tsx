import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { storeConfig } from './storeConfig'
import { buildOrderMessage } from './order'

type Cart = Record<number, number>
type CheckoutDetails = { name: string; location: string; note: string }
const emptyDetails: CheckoutDetails = { name: '', location: '', note: '' }

function App() {
  const products = storeConfig.products
  const [cart, setCart] = useState<Cart>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [details, setDetails] = useState<CheckoutDetails>(emptyDetails)

  const addProduct = (productId: number) => setCart((current) => ({ ...current, [productId]: (current[productId] || 0) + 1 }))
  const decreaseProduct = (productId: number) => setCart((current) => { const quantity = current[productId] || 0; if (quantity <= 1) { const updated = { ...current }; delete updated[productId]; return updated } return { ...current, [productId]: quantity - 1 } })
  const removeProduct = (productId: number) => setCart((current) => { const updated = { ...current }; delete updated[productId]; return updated })

  const cartItems = products.filter((product) => cart[product.id])
  const itemCount = cartItems.reduce((sum, product) => sum + cart[product.id], 0)
  const total = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0)
  const openCheckout = () => { setCartOpen(false); setCheckoutOpen(true) }
  const backToCart = () => { setCheckoutOpen(false); setCartOpen(true) }

  const sendToWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!details.name.trim() || !details.location.trim() || cartItems.length === 0) return

    const message = buildOrderMessage({
      storeName: storeConfig.name,
      items: cartItems.map((product) => ({ quantity: cart[product.id], name: product.name, lineTotal: product.price * cart[product.id] })),
      total,
      customer: details,
    })
    const whatsappUrl = `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(message)}`

    // Reset this storefront order before handing off. When the shopper returns,
    // a new order starts empty instead of silently carrying previous products.
    setCart({})
    setDetails(emptyDetails)
    setCheckoutOpen(false)
    setCartOpen(false)
    window.location.assign(whatsappUrl)
  }

  return <div className="store">
    <header className="store-header"><div className="header-brand"><div className="brand-mark">{storeConfig.name.charAt(0).toUpperCase()}</div><div><h1>{storeConfig.name}</h1><p>{storeConfig.tagline}</p></div></div><button className="header-cart" onClick={() => setCartOpen(true)} disabled={itemCount === 0}><span>My order</span><span className="cart-count">{itemCount}</span></button></header>
    <main><section className="intro"><div className="intro-copy"><p className="eyebrow">ORDER DIRECT • CHAT DIRECT</p><h2>Find something you love.<br />Order it in a few taps.</h2><p>Choose what you want, review your order and send it straight to {storeConfig.name} on WhatsApp.</p></div><div className="trust-strip"><span>✓ Clear prices</span><span>✓ No account needed</span><span>✓ Order on WhatsApp</span></div></section><section className="catalogue-heading"><div><p className="eyebrow">CATALOGUE</p><h3>Shop our picks</h3></div><span>{products.length} products</span></section><section className="products">{products.map((product) => { const quantity = cart[product.id] || 0; return <article className="product-card" key={product.id}><div className="image-wrapper"><img src={product.image} alt={product.name} loading="lazy" /></div><div className="product-info"><h3>{product.name}</h3><p className="price">KES {product.price.toLocaleString()}</p>{quantity === 0 ? <button className="add-button" onClick={() => addProduct(product.id)}>Add to order</button> : <div className="quantity-control"><button aria-label={`Remove one ${product.name}`} onClick={() => decreaseProduct(product.id)}>−</button><span>{quantity}</span><button aria-label={`Add one ${product.name}`} onClick={() => addProduct(product.id)}>+</button></div>}</div></article> })}</section></main>
    {itemCount > 0 && !cartOpen && !checkoutOpen && <div className="cart-bar"><div><span className="cart-bar-label">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your order</span><strong>KES {total.toLocaleString()}</strong></div><button onClick={() => setCartOpen(true)}>Review order →</button></div>}
    {cartOpen && <div className="cart-overlay" onClick={() => setCartOpen(false)}><aside className="cart-panel" onClick={(event) => event.stopPropagation()}><div className="cart-heading"><div><p className="eyebrow">YOUR ORDER</p><h2>Almost there</h2><p>Review exactly what will be sent.</p></div><button className="close-cart" aria-label="Close cart" onClick={() => setCartOpen(false)}>×</button></div><div className="cart-items">{cartItems.map((product) => { const quantity = cart[product.id]; return <div className="cart-item" key={product.id}><img src={product.image} alt="" /><div className="cart-item-details"><h3>{product.name}</h3><p>KES {product.price.toLocaleString()} each</p><div className="cart-item-actions"><div className="quantity-control compact"><button onClick={() => decreaseProduct(product.id)}>−</button><span>{quantity}</span><button onClick={() => addProduct(product.id)}>+</button></div><button className="remove-button" onClick={() => removeProduct(product.id)}>Remove</button></div></div><strong className="line-total">KES {(product.price * quantity).toLocaleString()}</strong></div> })}</div><div className="cart-summary"><div><span>Order total</span><strong>KES {total.toLocaleString()}</strong></div><button className="checkout-button" onClick={openCheckout}>Continue to checkout →</button><p>Only the items shown above will be prepared for WhatsApp.</p></div></aside></div>}
    {checkoutOpen && <div className="cart-overlay"><aside className="cart-panel checkout-panel"><div className="cart-heading"><div><p className="eyebrow">FINAL STEP</p><h2>Delivery details</h2><p>Confirm the order below before opening WhatsApp.</p></div><button className="close-cart" aria-label="Close checkout" onClick={() => setCheckoutOpen(false)}>×</button></div><form className="checkout-form" onSubmit={sendToWhatsApp}><div className="checkout-order"><h3>Order being sent</h3>{cartItems.map((product) => <div className="checkout-line" key={product.id}><span>{cart[product.id]} × {product.name}</span><strong>KES {(product.price * cart[product.id]).toLocaleString()}</strong></div>)}<div className="checkout-total"><span>Total</span><strong>KES {total.toLocaleString()}</strong></div></div><div className="field"><label htmlFor="customer-name">Your name</label><input id="customer-name" type="text" placeholder="e.g. Mary Wanjiku" value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} required /></div><div className="field"><label htmlFor="delivery-location">Delivery location</label><input id="delivery-location" type="text" placeholder="e.g. Kilimani, Nairobi" value={details.location} onChange={(event) => setDetails({ ...details, location: event.target.value })} required /></div><div className="field"><label htmlFor="order-note">Anything else? <span>Optional</span></label><textarea id="order-note" placeholder="Size, colour, delivery instructions..." value={details.note} onChange={(event) => setDetails({ ...details, note: event.target.value })} rows={4} /></div><button className="whatsapp-button" type="submit">Open this order in WhatsApp →</button><button className="back-button" type="button" onClick={backToCart}>← Back to order</button><p className="checkout-help">When you return to this shop after opening WhatsApp, the cart starts fresh.</p></form></aside></div>}
  </div>
}
export default App
