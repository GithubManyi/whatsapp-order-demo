import { useState } from 'react'
import type { FormEvent } from 'react'
import { buildSellerIntakeMessage, MAX_INTAKE_PRODUCTS } from './sellerIntake'
import type { IntakeProduct } from './sellerIntake'

const INTAKE_WHATSAPP = '254790290527'
const blankProduct = (): IntakeProduct => ({ name: '', price: '' })

export function SellerIntakePage() {
  const [sellerName, setSellerName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessWhatsApp, setBusinessWhatsApp] = useState('')
  const [tagline, setTagline] = useState('')
  const [products, setProducts] = useState<IntakeProduct[]>([blankProduct()])

  const updateProduct = (index: number, field: keyof IntakeProduct, value: string) => setProducts((current) => current.map((product, i) => i === index ? { ...product, [field]: value } : product))
  const addProduct = () => products.length < MAX_INTAKE_PRODUCTS && setProducts((current) => [...current, blankProduct()])
  const removeProduct = (index: number) => products.length > 1 && setProducts((current) => current.filter((_, i) => i !== index))

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validProducts = products.filter((product) => product.name.trim() && Number(product.price) > 0)
    if (validProducts.length === 0) return
    const message = buildSellerIntakeMessage({ sellerName, businessName, businessWhatsApp, tagline, products: validProducts })
    window.location.assign(`https://wa.me/${INTAKE_WHATSAPP}?text=${encodeURIComponent(message)}`)
  }

  return <div className="seller-intake-page"><header className="intake-topbar"><a href="/" className="intake-brand"><span>W</span><strong>WhatsApp Store</strong></a><a href="/">View sample store</a></header><main className="intake-shell"><section className="intake-intro"><p className="eyebrow">FOR SMALL SELLERS</p><h1>Get your own WhatsApp ordering page.</h1><p>Tell us about your business and products. We'll use these details to prepare your first storefront, then continue with you on WhatsApp.</p><div className="intake-steps"><span><b>1</b> Add your business</span><span><b>2</b> Add your products</span><span><b>3</b> Send details on WhatsApp</span></div></section><form className="intake-form" onSubmit={submit}><section className="intake-card"><div className="intake-card-heading"><span>01</span><div><h2>Your business</h2><p>The information customers should recognise.</p></div></div><div className="intake-grid"><label>Your name<input required value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder="e.g. Mary Wanjiku" /></label><label>Business / store name<input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Mary's Perfumes" /></label><label>Business WhatsApp number<input required value={businessWhatsApp} onChange={(e) => setBusinessWhatsApp(e.target.value)} placeholder="e.g. 0712 345 678" /></label><label>Short tagline<input required value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Affordable fragrances in Nairobi" /></label></div></section><section className="intake-card"><div className="intake-card-heading"><span>02</span><div><h2>Your products</h2><p>Add 1–10 products. You'll send the matching photos in WhatsApp after this form.</p></div></div><div className="intake-products">{products.map((product, index) => <div className="intake-product" key={index}><div className="product-number">{index + 1}</div><label>Product name<input required value={product.name} onChange={(e) => updateProduct(index, 'name', e.target.value)} placeholder="e.g. Island Sun Perfume" /></label><label>Price (KES)<input required min="1" inputMode="numeric" type="number" value={product.price} onChange={(e) => updateProduct(index, 'price', e.target.value)} placeholder="1500" /></label>{products.length > 1 && <button type="button" className="intake-remove" onClick={() => removeProduct(index)}>Remove</button>}</div>)}</div>{products.length < MAX_INTAKE_PRODUCTS && <button type="button" className="add-product-row" onClick={addProduct}>+ Add another product</button>}</section><section className="photo-note"><strong>Have your product photos ready</strong><p>After you send these details, WhatsApp will open. Send the product photos there in the same order as your list so we can match them correctly.</p></section><button className="intake-submit" type="submit">Submit my store on WhatsApp →</button><p className="intake-footnote">No account or payment is required for this first setup.</p></form></main></div>
}
