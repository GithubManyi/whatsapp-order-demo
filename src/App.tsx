import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { storeConfig } from './storeConfig'
import { buildOrderMessage } from './order'
import { SellerIntakePage } from './SellerIntakePage'

type Cart = Record<number, number>
type CheckoutDetails = { name: string; location: string; note: string }
const emptyDetails: CheckoutDetails = { name: '', location: '', note: '' }

function App() {
  if (window.location.pathname === '/for-sellers' || window.location.pathname === '/for-sellers/') return <SellerIntakePage />

  const products = storeConfig.products
  const [cart, setCart] = useState<Cart>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [details, setDetails] = useState<CheckoutDetails>(emptyDetails)
  const addProduct = (id:number)=>setCart(c=>({...c,[id]:(c[id]||0)+1}))
  const decreaseProduct=(id:number)=>setCart(c=>{const q=c[id]||0;if(q<=1){const n={...c};delete n[id];return n}return{...c,[id]:q-1}})
  const removeProduct=(id:number)=>setCart(c=>{const n={...c};delete n[id];return n})
  const cartItems=products.filter(p=>cart[p.id]); const itemCount=cartItems.reduce((s,p)=>s+cart[p.id],0); const total=cartItems.reduce((s,p)=>s+p.price*cart[p.id],0)
  const sendToWhatsApp=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(!details.name.trim()||!details.location.trim()||!cartItems.length)return;const message=buildOrderMessage({storeName:storeConfig.name,items:cartItems.map(p=>({quantity:cart[p.id],name:p.name,lineTotal:p.price*cart[p.id]})),total,customer:details});const url=`https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(message)}`;setCart({});setDetails(emptyDetails);setCheckoutOpen(false);setCartOpen(false);window.location.assign(url)}

  return <div className="store">
    <header className="store-header"><div className="header-brand"><div className="brand-mark">{storeConfig.name.charAt(0).toUpperCase()}</div><div><h1>{storeConfig.name}</h1><p>{storeConfig.tagline}</p></div></div><button className="header-cart" onClick={()=>setCartOpen(true)} disabled={!itemCount}><span>My order</span><span className="cart-count">{itemCount}</span></button></header>
    <main><section className="intro"><div className="intro-copy"><p className="eyebrow">ORDER DIRECT • CHAT DIRECT</p><h2>Find something you love.<br/>Order it in a few taps.</h2><p>Choose what you want, review your order and send it straight to {storeConfig.name} on WhatsApp.</p></div><div className="trust-strip"><span>✓ Clear prices</span><span>✓ No account needed</span><span>✓ Order on WhatsApp</span></div></section><section className="catalogue-heading"><div><p className="eyebrow">CATALOGUE</p><h3>Shop our picks</h3></div><span>{products.length} products</span></section><section className="products">{products.map(p=>{const q=cart[p.id]||0;return <article className="product-card" key={p.id}><div className="image-wrapper"><img src={p.image} alt={p.name} loading="lazy"/></div><div className="product-info"><h3>{p.name}</h3><p className="price">KES {p.price.toLocaleString()}</p>{!q?<button className="add-button" onClick={()=>addProduct(p.id)}>Add to order</button>:<div className="quantity-control"><button onClick={()=>decreaseProduct(p.id)}>−</button><span>{q}</span><button onClick={()=>addProduct(p.id)}>+</button></div>}</div></article>})}</section><div className="seller-cta"><div><strong>Sell through WhatsApp too?</strong><span>Get a simple ordering page for your own business.</span></div><a href="/for-sellers">Create my store →</a></div></main>
    {itemCount>0&&!cartOpen&&!checkoutOpen&&<div className="cart-bar"><div><span className="cart-bar-label">{itemCount} {itemCount===1?'item':'items'} in your order</span><strong>KES {total.toLocaleString()}</strong></div><button onClick={()=>setCartOpen(true)}>Review order →</button></div>}
    {cartOpen&&<div className="cart-overlay" onClick={()=>setCartOpen(false)}><aside className="cart-panel" onClick={e=>e.stopPropagation()}><div className="cart-heading"><div><p className="eyebrow">YOUR ORDER</p><h2>Almost there</h2><p>Review exactly what will be sent.</p></div><button className="close-cart" onClick={()=>setCartOpen(false)}>×</button></div><div className="cart-items">{cartItems.map(p=>{const q=cart[p.id];return <div className="cart-item" key={p.id}><img src={p.image} alt=""/><div className="cart-item-details"><h3>{p.name}</h3><p>KES {p.price.toLocaleString()} each</p><div className="cart-item-actions"><div className="quantity-control compact"><button onClick={()=>decreaseProduct(p.id)}>−</button><span>{q}</span><button onClick={()=>addProduct(p.id)}>+</button></div><button className="remove-button" onClick={()=>removeProduct(p.id)}>Remove</button></div></div><strong className="line-total">KES {(p.price*q).toLocaleString()}</strong></div>})}</div><div className="cart-summary"><div><span>Order total</span><strong>KES {total.toLocaleString()}</strong></div><button className="checkout-button" onClick={()=>{setCartOpen(false);setCheckoutOpen(true)}}>Continue to checkout →</button><p>Only the items shown above will be prepared for WhatsApp.</p></div></aside></div>}
    {checkoutOpen&&<div className="cart-overlay"><aside className="cart-panel checkout-panel"><div className="cart-heading"><div><p className="eyebrow">FINAL STEP</p><h2>Delivery details</h2><p>Confirm the order below before opening WhatsApp.</p></div><button className="close-cart" onClick={()=>setCheckoutOpen(false)}>×</button></div><form className="checkout-form" onSubmit={sendToWhatsApp}><div className="checkout-order"><h3>Order being sent</h3>{cartItems.map(p=><div className="checkout-line" key={p.id}><span>{cart[p.id]} × {p.name}</span><strong>KES {(p.price*cart[p.id]).toLocaleString()}</strong></div>)}<div className="checkout-total"><span>Total</span><strong>KES {total.toLocaleString()}</strong></div></div><div className="field"><label>Your name</label><input required value={details.name} onChange={e=>setDetails({...details,name:e.target.value})}/></div><div className="field"><label>Delivery location</label><input required value={details.location} onChange={e=>setDetails({...details,location:e.target.value})}/></div><div className="field"><label>Anything else? <span>Optional</span></label><textarea rows={4} value={details.note} onChange={e=>setDetails({...details,note:e.target.value})}/></div><button className="whatsapp-button" type="submit">Open this order in WhatsApp →</button><button className="back-button" type="button" onClick={()=>{setCheckoutOpen(false);setCartOpen(true)}}>← Back to order</button><p className="checkout-help">When you return to this shop after opening WhatsApp, the cart starts fresh.</p></form></aside></div>}
  </div>
}
export default App
