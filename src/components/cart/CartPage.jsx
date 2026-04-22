import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, CART_SIZES, formatPrice, parsePrice } from '../../context/CartContext'

const EASE     = [0.76, 0, 0.24, 1]
const EASE_OUT = [0.16, 1, 0.3, 1]

/* ─── Column layout constants ──────────────────────────────────
   nr | image | product+size | price | total
   Must match header + CartItem grids.                          */
const COLS = '52px 100px 1fr 130px 150px'
const PAD  = '0 48px'

/* ─── Size picker — dark dropdown below a row ─────────────────── */
function SizePicker({ currentSize, onSelect }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit   ={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.38, ease: EASE_OUT }}
      style={{ overflow: 'hidden' }}
    >
      <div
        className="cart-size-picker"
        style={{
          background: '#0a0a0a',
          padding   : '20px 48px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.45em', color: '#F2EFEB' }}>
            SIZE
          </span>
          <span style={{ fontFamily: 'var(--font)', fontSize: '9px', letterSpacing: '0.45em', color: 'rgba(242,239,235,0.35)' }}>
            SIZE GUIDE
          </span>
        </div>

        <div style={{ display: 'flex', gap: '28px' }}>
          {CART_SIZES.map(size => {
            const isActive = currentSize === size
            return (
              <motion.button
                key={size}
                data-cursor-hover
                onClick={() => onSelect(size)}
                whileHover={{ color: '#F2EFEB' }}
                transition={{ duration: 0.15 }}
                style={{
                  background   : 'transparent',
                  border       : 'none',
                  outline      : 'none',
                  cursor       : 'none',
                  fontFamily   : 'var(--font)',
                  fontSize     : '16px',
                  fontWeight   : isActive ? 700 : 400,
                  letterSpacing: '0.08em',
                  color        : isActive ? '#F2EFEB' : 'rgba(242,239,235,0.35)',
                  padding      : 0,
                }}
              >
                {size}
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Individual cart row ───────────────────────────────────── */
function CartItem({ item, index, openSizeId, setOpenSizeId }) {
  const { removeItem, updateSize } = useCart()
  const isOpen    = openSizeId === item.id
  const itemTotal = parsePrice(item.product.price) * item.qty

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit   ={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Row */}
      <div
        className="cart-item-row"
        style={{
          display              : 'grid',
          gridTemplateColumns  : COLS,
          gap                  : '16px',
          padding              : '22px 48px',
          alignItems           : 'start',
        }}
      >
        {/* Nr + × remove */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '2px' }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(0,0,0,0.4)' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <button
            data-cursor-hover
            onClick={() => removeItem(item.id)}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              cursor: 'none', padding: 0, width: 'fit-content',
              fontFamily: 'var(--font)', fontSize: '12px',
              color: 'rgba(0,0,0,0.3)',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#0a0a0a'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.3)'}
          >
            ✕
          </button>
        </div>

        {/* Product image */}
        <div style={{ width: '90px', height: '116px', overflow: 'hidden', background: item.product.cardBg, flexShrink: 0 }}>
          <img
            src={item.product.image}
            alt={item.product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
        </div>

        {/* Name + size selector */}
        <div style={{ paddingTop: '2px' }}>
          <p style={{
            fontFamily   : 'var(--font)',
            fontSize     : '11px',
            fontWeight   : 700,
            letterSpacing: '0.15em',
            color        : '#0a0a0a',
            lineHeight   : 1.3,
            marginBottom : '14px',
          }}>
            {item.product.name}
          </p>

          {/* Size toggle button */}
          <button
            data-cursor-hover
            onClick={() => setOpenSizeId(isOpen ? null : item.id)}
            style={{
              background   : 'transparent',
              border       : 'none',
              outline      : 'none',
              cursor       : 'none',
              padding      : '0 0 3px 0',
              borderBottom : '1px solid rgba(0,0,0,0.25)',
              fontFamily   : 'var(--font)',
              fontSize     : '11px',
              fontWeight   : 500,
              letterSpacing: '0.2em',
              color        : '#0a0a0a',
              display      : 'flex',
              alignItems   : 'center',
              gap          : '6px',
            }}
          >
            {item.size || 'SELECT SIZE'}
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              style={{ fontSize: '8px', display: 'inline-block', lineHeight: 1 }}
            >
              ↓
            </motion.span>
          </button>

          {/* Qty if > 1 */}
          {item.qty > 1 && (
            <span style={{ fontFamily: 'var(--font)', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.35)', display: 'block', marginTop: '8px' }}>
              ×{item.qty}
            </span>
          )}

          {/* Mobile-only price + total — hidden on desktop */}
          <div className="cart-mobile-price-row" style={{ display: 'none', marginTop: '12px' }}>
            <span style={{
              fontFamily: 'var(--font)', fontSize: '10px',
              color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', display: 'block',
            }}>
              {item.product.price}
            </span>
            <span style={{
              fontFamily: 'var(--font)', fontSize: '14px', fontWeight: 700,
              color: '#0a0a0a', letterSpacing: '0.03em', display: 'block', marginTop: '4px',
            }}>
              {formatPrice(itemTotal)}
            </span>
          </div>
        </div>

        {/* Unit price */}
        <p className="cart-col-price" style={{ textAlign: 'right', fontFamily: 'var(--font)', fontSize: '11px', color: 'rgba(0,0,0,0.45)', paddingTop: '2px' }}>
          {item.product.price}
        </p>

        {/* Total */}
        <p className="cart-col-total" style={{ textAlign: 'right', fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '0.03em', paddingTop: '2px' }}>
          {formatPrice(itemTotal)}
        </p>
      </div>

      {/* Size picker dropdown */}
      <AnimatePresence>
        {isOpen && (
          <SizePicker
            key="sizepicker"
            currentSize={item.size}
            onSelect={(size) => {
              updateSize(item.id, size)
              setOpenSizeId(null)
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── BUY button (same slide-text style) ─────────────────────── */
function BuyButton({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      data-cursor-hover
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width         : '180px',
        height        : '48px',
        background    : '#0a0a0a',
        display       : 'flex',
        alignItems    : 'center',
        justifyContent: 'center',
        overflow      : 'hidden',
        position      : 'relative',
        cursor        : 'none',
        borderRadius  : '2px',
        flexShrink    : 0,
      }}
    >
      <motion.span
        animate={{ y: hov ? '-110%' : '0%', opacity: hov ? 0 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ position: 'absolute', fontFamily: 'var(--font)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.45em', color: '#F2EFEB' }}
      >
        BUY
      </motion.span>
      <motion.span
        animate={{ y: hov ? '0%' : '110%', opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ position: 'absolute', fontFamily: 'var(--font)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.45em', color: '#F2EFEB' }}
      >
        BUY
      </motion.span>
    </div>
  )
}

/* ─── CONTINUE SHOPPING button — vertical text flip ──────────── */
function ContinueButton({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      data-cursor-hover
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        border        : 'none',
        outline       : 'none',
        display       : 'inline-flex',
        alignItems    : 'center',
        justifyContent: 'center',
        height        : '48px',
        padding       : '0 28px',
        background    : '#0a0a0a',
        overflow      : 'hidden',
        position      : 'relative',
        cursor        : 'none',
        borderRadius  : '2px',
        marginTop     : '32px',
      }}
    >
      {/* Sizer: absolute children don't size the button */}
      <span
        aria-hidden="true"
        style={{
          fontFamily   : 'var(--font)',
          fontSize     : '9px',
          fontWeight   : 700,
          letterSpacing: '0.38em',
          whiteSpace   : 'nowrap',
          visibility   : 'hidden',
        }}
      >
        ← CONTINUE SHOPPING
      </span>
      <motion.span
        animate={{ y: hov ? '-110%' : '0%', opacity: hov ? 0 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ position: 'absolute', fontFamily: 'var(--font)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.38em', color: '#F2EFEB', whiteSpace: 'nowrap' }}
      >
        ← CONTINUE SHOPPING
      </motion.span>
      <motion.span
        animate={{ y: hov ? '0%' : '110%', opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ position: 'absolute', fontFamily: 'var(--font)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.38em', color: '#F2EFEB', whiteSpace: 'nowrap' }}
      >
        ← CONTINUE SHOPPING
      </motion.span>
    </button>
  )
}

export default function CartPage({ onClose, onBuy }) {
  const { items, totalCount, totalPrice } = useCart()
  const [openSizeId, setOpenSizeId] = useState(null)

  return (
    <div
      style={{
        background  : '#F2EFEB',
        minHeight   : '100svh',
        paddingTop  : '72px',
        paddingBottom: '88px',
        fontFamily  : 'var(--font)',
      }}
    >
      {/* Column headers */}
      <motion.div
        className="cart-headers"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        style={{
          display             : 'grid',
          gridTemplateColumns : COLS,
          gap                 : '16px',
          padding             : '20px 48px',
          borderBottom        : '1px solid rgba(0,0,0,0.12)',
        }}
      >
        {[
          ['Nr',            'left',  ''],
          ['',              'left',  ''],
          ['PRODUCT & SIZE','left',  ''],
          ['PRICE',         'right', 'cart-col-price'],
          ['TOTAL COST',    'right', 'cart-col-total'],
        ].map(([h, align, cls], i) => (
          <span key={i} className={cls} style={{ fontFamily: 'var(--font)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.45em', color: 'rgba(0,0,0,0.3)', textAlign: align }}>
            {h}
          </span>
        ))}
      </motion.div>

      {/* Empty state */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
          style={{ padding: '100px 48px', textAlign: 'center' }}
        >
          <p style={{ fontFamily: 'var(--font)', fontSize: '11px', letterSpacing: '0.35em', color: 'rgba(0,0,0,0.3)', marginBottom: '8px' }}>
            YOUR BASKET IS EMPTY
          </p>
          <p style={{ fontFamily: 'var(--font)', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.2)', marginBottom: '36px' }}>
            Browse our collection and add items.
          </p>
          <ContinueButton onClick={onClose} />
        </motion.div>
      )}

      {/* Cart rows */}
      <AnimatePresence>
        {items.map((item, i) => (
          <CartItem
            key={item.id}
            item={item}
            index={i}
            openSizeId={openSizeId}
            setOpenSizeId={setOpenSizeId}
          />
        ))}
      </AnimatePresence>

      {/* Sticky footer — only when items exist */}
      {items.length > 0 && (
        <div
          className="cart-footer"
          style={{
            position      : 'fixed',
            bottom        : 0,
            left          : 0,
            right         : 0,
            display       : 'flex',
            justifyContent: 'space-between',
            alignItems    : 'center',
            padding       : '16px 48px',
            background    : '#F2EFEB',
            borderTop     : '1px solid rgba(0,0,0,0.1)',
            zIndex        : 20,
          }}
        >
          {/* Left: shipping note */}
          <p className="cart-shipping" style={{ fontFamily: 'var(--font)', fontSize: '10px', letterSpacing: '0.08em', color: 'rgba(0,0,0,0.4)' }}>
            Free standard{' '}
            <span style={{ textDecoration: 'underline' }}>shipping</span>
            {' '}and{' '}
            <span style={{ textDecoration: 'underline' }}>return</span>
            . India.
          </p>

          {/* Center: BUY */}
          <div className="cart-buy-wrap">
            <BuyButton onClick={onBuy} />
          </div>

          {/* Right: total */}
          <p className="cart-footer-total" style={{ fontFamily: 'var(--font)', fontSize: 'clamp(18px, 2vw, 28px)', fontWeight: 900, letterSpacing: '0.03em', color: '#0a0a0a' }}>
            {formatPrice(totalPrice)}
          </p>
        </div>
      )}

      <style>{`
        /* ─── Mobile responsive ─── */
        @media (max-width: 768px) {

          /* Headers: slim to 3 cols */
          .cart-headers {
            grid-template-columns: 44px 80px 1fr !important;
            padding: 10px 16px !important;
            gap: 10px !important;
          }

          /* Hide PRICE + TOTAL COST columns everywhere */
          .cart-col-price,
          .cart-col-total {
            display: none !important;
          }

          /* Cart item row: 3 cols, compact padding */
          .cart-item-row {
            grid-template-columns: 44px 80px 1fr !important;
            padding: 14px 16px !important;
            gap: 16px !important;
          }

          /* Show the inline mobile price block */
          .cart-mobile-price-row {
            display: block !important;
          }

          /* SizePicker compact padding */
          .cart-size-picker {
            padding: 16px !important;
          }

          /* Footer: 2 rows — [total | BUY] then [shipping] */
          .cart-footer {
            flex-wrap: wrap !important;
            padding: 12px 16px !important;
            gap: 8px 12px !important;
            align-items: center !important;
          }

          .cart-footer-total {
            order: 1;
            font-size: clamp(20px, 5vw, 26px) !important;
            flex: 0 0 auto;
          }

          .cart-buy-wrap {
            order: 2;
            flex: 1 !important;
            min-width: 0;
          }

          .cart-buy-wrap > div {
            width: 100% !important;
          }

          .cart-shipping {
            order: 3;
            width: 100% !important;
            font-size: 9px !important;
            letter-spacing: 0.05em !important;
            line-height: 1.55 !important;
          }
        }
      `}</style>
    </div>
  )
}
