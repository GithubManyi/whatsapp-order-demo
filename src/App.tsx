import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { storeConfig } from './storeConfig'

type Cart = Record<number, number>

type CheckoutDetails = {
  name: string
  location: string
  note: string
}

function App() {
  const products = storeConfig.products
  const [cart, setCart] = useState<Cart>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const [details, setDetails] = useState<CheckoutDetails>({
    name: '',
    location: '',
    note: '',
  })

  const addProduct = (productId: number) => {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] || 0) + 1,
    }))
  }

  const decreaseProduct = (productId: number) => {
    setCart((current) => {
      const quantity = current[productId] || 0

      if (quantity <= 1) {
        const updated = { ...current }
        delete updated[productId]
        return updated
      }

      return {
        ...current,
        [productId]: quantity - 1,
      }
    })
  }

  const removeProduct = (productId: number) => {
    setCart((current) => {
      const updated = { ...current }
      delete updated[productId]
      return updated
    })
  }

  const cartItems = products.filter((product) => cart[product.id])

  const itemCount = cartItems.reduce(
    (total, product) => total + cart[product.id],
    0,
  )

  const total = cartItems.reduce(
    (sum, product) => sum + product.price * cart[product.id],
    0,
  )

  const openCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  const backToCart = () => {
    setCheckoutOpen(false)
    setCartOpen(true)
  }

  const sendToWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!details.name.trim() || !details.location.trim()) {
      return
    }

    const orderLines = cartItems.map((product) => {
      const quantity = cart[product.id]
      const lineTotal = product.price * quantity

      return `${quantity} × ${product.name} — KES ${lineTotal.toLocaleString()}`
    })

    const message = [
      `Hello ${storeConfig.name} 👋`,
      '',
      "I'd like to place an order:",
      '',
      ...orderLines,
      '',
      `Total: KES ${total.toLocaleString()}`,
      '',
      `Name: ${details.name.trim()}`,
      `Delivery: ${details.location.trim()}`,
      details.note.trim() ? `Note: ${details.note.trim()}` : '',
      '',
      'Sent from your online order page.',
    ]
      .filter((line) => line !== '')
      .join('\n')

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl =
      `https://wa.me/${storeConfig.whatsapp}?text=${encodedMessage}`

    window.location.href = whatsappUrl
  }

  return (
    <div className="store">
      <header className="store-header">
        <div className="header-brand">
          <div className="brand-mark">
            {storeConfig.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>{storeConfig.name}</h1>
            <p>{storeConfig.tagline}</p>
          </div>
        </div>

        <button
          className="header-cart"
          onClick={() => setCartOpen(true)}
          disabled={itemCount === 0}
        >
          <span>Order</span>
          <span className="cart-count">{itemCount}</span>
        </button>
      </header>

      <main>
        <section className="intro">
          <p className="eyebrow">SHOP ONLINE</p>
          <h2>What would you like today?</h2>
          <p>
            Select your products and we'll prepare your order for WhatsApp.
          </p>
        </section>

        <section className="products">
          {products.map((product) => {
            const quantity = cart[product.id] || 0

            return (
              <article className="product-card" key={product.id}>
                <div className="image-wrapper">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>

                  <p className="price">
                    KES {product.price.toLocaleString()}
                  </p>

                  {quantity === 0 ? (
                    <button
                      className="add-button"
                      onClick={() => addProduct(product.id)}
                    >
                      Add to order
                    </button>
                  ) : (
                    <div className="quantity-control">
                      <button
                        aria-label={`Remove one ${product.name}`}
                        onClick={() => decreaseProduct(product.id)}
                      >
                        −
                      </button>

                      <span>{quantity}</span>

                      <button
                        aria-label={`Add one ${product.name}`}
                        onClick={() => addProduct(product.id)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      </main>

      {itemCount > 0 && !cartOpen && !checkoutOpen && (
        <div className="cart-bar">
          <div>
            <span className="cart-bar-label">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>

            <strong>KES {total.toLocaleString()}</strong>
          </div>

          <button onClick={() => setCartOpen(true)}>
            View order
          </button>
        </div>
      )}

      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-heading">
              <div>
                <p className="eyebrow">YOUR CART</p>
                <h2>Your order</h2>
              </div>

              <button
                className="close-cart"
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="cart-items">
              {cartItems.map((product) => {
                const quantity = cart[product.id]

                return (
                  <div className="cart-item" key={product.id}>
                    <img src={product.image} alt="" />

                    <div className="cart-item-details">
                      <h3>{product.name}</h3>

                      <p>
                        KES {product.price.toLocaleString()} each
                      </p>

                      <div className="cart-item-actions">
                        <div className="quantity-control compact">
                          <button
                            onClick={() => decreaseProduct(product.id)}
                          >
                            −
                          </button>

                          <span>{quantity}</span>

                          <button
                            onClick={() => addProduct(product.id)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-button"
                          onClick={() => removeProduct(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <strong className="line-total">
                      KES {(product.price * quantity).toLocaleString()}
                    </strong>
                  </div>
                )
              })}
            </div>

            <div className="cart-summary">
              <div>
                <span>Total</span>
                <strong>KES {total.toLocaleString()}</strong>
              </div>

              <button
                className="checkout-button"
                onClick={openCheckout}
              >
                Continue to checkout
              </button>

              <p>
                No payment required here. Your order will be sent
                directly to the seller on WhatsApp.
              </p>
            </div>
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="cart-overlay">
          <aside className="cart-panel checkout-panel">
            <div className="cart-heading">
              <div>
                <p className="eyebrow">FINAL STEP</p>
                <h2>Where should we deliver?</h2>
              </div>

              <button
                className="close-cart"
                aria-label="Close checkout"
                onClick={() => setCheckoutOpen(false)}
              >
                ×
              </button>
            </div>

            <form
              className="checkout-form"
              onSubmit={sendToWhatsApp}
            >
              <div className="checkout-order">
                <h3>Order summary</h3>

                {cartItems.map((product) => (
                  <div
                    className="checkout-line"
                    key={product.id}
                  >
                    <span>
                      {cart[product.id]} × {product.name}
                    </span>

                    <strong>
                      KES{' '}
                      {(
                        product.price * cart[product.id]
                      ).toLocaleString()}
                    </strong>
                  </div>
                ))}

                <div className="checkout-total">
                  <span>Total</span>
                  <strong>KES {total.toLocaleString()}</strong>
                </div>
              </div>

              <div className="field">
                <label htmlFor="customer-name">
                  Your name
                </label>

                <input
                  id="customer-name"
                  type="text"
                  placeholder="e.g. Mary Wanjiku"
                  value={details.name}
                  onChange={(event) =>
                    setDetails({
                      ...details,
                      name: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="delivery-location">
                  Delivery location
                </label>

                <input
                  id="delivery-location"
                  type="text"
                  placeholder="e.g. Kilimani, Nairobi"
                  value={details.location}
                  onChange={(event) =>
                    setDetails({
                      ...details,
                      location: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="order-note">
                  Note <span>Optional</span>
                </label>

                <textarea
                  id="order-note"
                  placeholder="Size, colour, delivery instructions..."
                  value={details.note}
                  onChange={(event) =>
                    setDetails({
                      ...details,
                      note: event.target.value,
                    })
                  }
                  rows={4}
                />
              </div>

              <button
                className="whatsapp-button"
                type="submit"
              >
                <span className="whatsapp-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16.004 3C8.82 3 3 8.82 3 16c0 2.504.704 4.84 1.928 6.824L3.2 29l6.36-1.672A12.93 12.93 0 0 0 16.004 29C23.18 29 29 23.18 29 16S23.18 3 16.004 3Zm0 23.82a10.8 10.8 0 0 1-5.504-1.504l-.392-.232-3.776.992 1.008-3.68-.256-.408A10.78 10.78 0 0 1 5.18 16c0-5.968 4.856-10.82 10.824-10.82 5.968 0 10.816 4.852 10.816 10.82 0 5.968-4.848 10.82-10.816 10.82Zm5.936-8.104c-.324-.164-1.928-.952-2.228-1.06-.3-.112-.516-.164-.736.164-.216.324-.84 1.06-1.032 1.276-.188.22-.38.244-.704.084-.324-.164-1.372-.508-2.612-1.616-.964-.86-1.616-1.924-1.804-2.252-.192-.324-.02-.5.144-.66.148-.144.324-.38.488-.568.164-.192.216-.328.324-.544.108-.216.056-.408-.028-.568-.08-.164-.732-1.768-1.004-2.42-.264-.636-.532-.552-.732-.56h-.624c-.216 0-.568.08-.868.408-.3.324-1.14 1.116-1.14 2.72 0 1.604 1.168 3.152 1.332 3.368.164.216 2.296 3.504 5.56 4.916.776.336 1.384.536 1.856.688.78.248 1.488.212 2.048.128.624-.092 1.928-.788 2.2-1.548.272-.756.272-1.404.192-1.54-.08-.136-.296-.216-.62-.376Z" />
                  </svg>
                </span>
                Send Order on WhatsApp
              </button>

              <button
                className="back-button"
                type="button"
                onClick={backToCart}
              >
                ← Back to order
              </button>

              <p className="checkout-help">
                WhatsApp will open with your order already
                prepared. Review it and press Send.
              </p>
            </form>
          </aside>
        </div>
      )}
    </div>
  )
}

export default App