import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, CART_SIZES } from '../../context/CartContext'

const EASE_OUT = [0.16, 1, 0.3, 1]
const EASE     = [0.76, 0, 0.24, 1]

export default function ProductCard({ product, index, onProductSelect, cardWidth = 260, imageHeight = 340 }) {
  const { addItem } = useCart()

  const [hovered,        setHovered]        = useState(false)
  const [showSizePicker, setShowSizePicker] = useState(false)
  const [justAdded,      setJustAdded]      = useState(null)   // size string or null
  const [activeImg,      setActiveImg]      = useState(product.image)

  /* All unique images: main + alts — deduplicated */
  const thumbImages = [
    product.image,
    product.altA,
    product.altB,
  ].filter((src, i, arr) => src && arr.indexOf(src) === i)

  const handleAddToCart = (size) => {
    addItem(product, size)
    setShowSizePicker(false)
    setJustAdded(size)
    setTimeout(() => setJustAdded(null), 2000)
  }

  return (
    <motion.div
      className="product-card-root"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        /* Keep size picker alive — user may not have picked yet */
        /* Only close if moving fully away */
        setShowSizePicker(false)
      }}
      onTouchStart={() => setHovered((v) => !v)}
      style={{ cursor: 'none' }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: index * 0.1 }}
    >
      <motion.div
        className="product-card-shell"
        animate={{ scale: hovered ? 1.018 : 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        style={{
          width     : `${cardWidth}px`,
          background: product.cardBg,
          border    : '1px solid rgba(255,255,255,0.04)',
          position  : 'relative',
          overflow  : 'hidden',
          flexShrink: 0,
        }}
      >
        {/* ── IMAGE AREA ── */}
        <div style={{ position: 'relative', height: `${imageHeight}px`, overflow: 'hidden', background: product.cardBg }}>

          {/* Main product image — cross-fades when activeImg changes */}
          <AnimatePresence mode="crossfade" initial={false}>
            <motion.img
              key={activeImg}
              src={activeImg}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              style={{
                position      : 'absolute',
                inset         : 0,
                width         : '100%',
                height        : '100%',
                objectFit     : 'contain',
                objectPosition: 'center center',
                display       : 'block',
              }}
            />
          </AnimatePresence>

          {/* Product ID — top left */}
          <span style={{
            position: 'absolute', top: '14px', left: '14px',
            fontFamily: 'var(--font)', fontSize: '9px', letterSpacing: '0.3em',
            color: 'rgba(242,239,235,0.45)', zIndex: 2,
          }}>
            {product.id}
          </span>

          {/* Tag — top right */}
          <span style={{
            position: 'absolute', top: '14px', right: '14px',
            fontFamily: 'var(--font)', fontSize: '8px', letterSpacing: '0.25em',
            color: 'rgba(242,239,235,0.35)', zIndex: 2,
          }}>
            {product.tag}
          </span>

          {/* ── HOVER OVERLAY ── */}
          <AnimatePresence>
            {hovered && (
              <>
                {/* Scrim */}
                <motion.div
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', zIndex: 3 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />

                {/* Alt thumbnails — bottom-left, above button row */}
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom  : '68px',
                    left    : '12px',
                    display : 'flex',
                    gap     : '6px',
                    zIndex  : 5,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  /* Stop touch from bubbling to card root (which toggles hovered off) */
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  {thumbImages.map((src, i) => (
                    <motion.div
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setActiveImg(src) }}
                      onTouchStart={(e) => { e.stopPropagation(); setActiveImg(src) }}
                      style={{
                        width     : '38px',
                        height    : '48px',
                        overflow  : 'hidden',
                        flexShrink: 0,
                        cursor    : 'pointer',
                        /* Highlighted border for the active image */
                        border    : activeImg === src
                          ? '1.5px solid rgba(242,239,235,0.95)'
                          : '1px solid rgba(242,239,235,0.3)',
                        boxShadow : activeImg === src
                          ? '0 0 0 1px rgba(242,239,235,0.3)'
                          : 'none',
                        transition: 'border 0.2s, box-shadow 0.2s',
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0  }}
                      exit   ={{ opacity: 0, y: 6  }}
                      transition={{ duration: 0.35, ease: EASE_OUT, delay: i * 0.07 }}
                    >
                      <img
                        src={src}
                        alt=""
                        style={{
                          width         : '100%',
                          height        : '100%',
                          objectFit     : 'cover',
                          objectPosition: 'center top',
                          display       : 'block',
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  className="product-card-actions"
                  style={{
                    position: 'absolute',
                    bottom  : '12px',
                    left    : '12px',
                    right   : '12px',
                    display : 'flex',
                    gap     : '6px',
                    zIndex  : 5,
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0  }}
                  exit   ={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.38, ease: EASE_OUT, delay: 0.05 }}
                >
                  {/* VIEW DETAILS */}
                  <button
                    data-cursor-hover
                    onClick={() => onProductSelect?.(product)}
                    style={{
                      flex          : 1,
                      display       : 'flex',
                      alignItems    : 'center',
                      justifyContent: 'space-between',
                      padding       : '11px 14px',
                      background    : 'rgba(242,239,235,0.94)',
                      border        : '1px solid rgba(242,239,235,0.2)',
                      backdropFilter: 'blur(6px)',
                      cursor        : 'none',
                      fontFamily    : 'var(--font)',
                      fontSize      : '9px',
                      fontWeight    : 700,
                      letterSpacing : '0.22em',
                      color         : '#0a0a0a',
                      borderRadius  : '2px',
                      whiteSpace    : 'nowrap',
                      outline       : 'none',
                    }}
                  >
                    <span>VIEW DETAILS</span>
                    <span style={{ fontSize: '16px', fontWeight: 300, lineHeight: 1, marginLeft: '8px' }}>+</span>
                  </button>

                  {/* Add to cart — toggles size picker */}
                  <motion.button
                    data-cursor-hover
                    onClick={(e) => { e.stopPropagation(); setShowSizePicker(p => !p) }}
                    animate={{
                      background: showSizePicker || justAdded
                        ? '#0a0a0a'
                        : 'rgba(242,239,235,0.94)',
                    }}
                    transition={{ duration: 0.25 }}
                    style={{
                      width         : '40px',
                      flexShrink    : 0,
                      display       : 'flex',
                      alignItems    : 'center',
                      justifyContent: 'center',
                      border        : '1px solid rgba(242,239,235,0.2)',
                      backdropFilter: 'blur(6px)',
                      cursor        : 'none',
                      borderRadius  : '2px',
                      outline       : 'none',
                    }}
                  >
                    {justAdded ? (
                      /* Checkmark after adding */
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="#F2EFEB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      /* Bag icon */
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke={showSizePicker ? '#F2EFEB' : '#0a0a0a'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                    )}
                  </motion.button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ── SIZE PICKER — slides up from bottom of image ── */}
          <AnimatePresence>
            {showSizePicker && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%'  }}
                exit   ={{ y: '100%' }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                style={{
                  position : 'absolute',
                  bottom   : 0,
                  left     : 0,
                  right    : 0,
                  background: '#0a0a0a',
                  padding  : '16px 14px',
                  zIndex   : 9,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'var(--font)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.45em', color: '#F2EFEB' }}>
                    SELECT SIZE
                  </span>
                  <button
                    data-cursor-hover
                    onClick={() => setShowSizePicker(false)}
                    style={{ background: 'none', border: 'none', cursor: 'none', color: 'rgba(242,239,235,0.4)', fontFamily: 'var(--font)', fontSize: '12px', padding: 0 }}
                  >
                    ✕
                  </button>
                </div>

                {/* Size row */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {CART_SIZES.map(size => (
                    <motion.button
                      key={size}
                      data-cursor-hover
                      onClick={() => handleAddToCart(size)}
                      whileHover={{ background: 'rgba(242,239,235,0.15)' }}
                      style={{
                        flex         : 1,
                        padding      : '9px 0',
                        background   : 'transparent',
                        border       : '1px solid rgba(242,239,235,0.2)',
                        cursor       : 'none',
                        outline      : 'none',
                        fontFamily   : 'var(--font)',
                        fontSize     : '9px',
                        fontWeight   : 600,
                        letterSpacing: '0.15em',
                        color        : '#F2EFEB',
                        borderRadius : '2px',
                      }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .product-card-actions {
              gap: 8px !important;
            }

            .product-card-actions button {
              min-height: 44px;
            }
          }
        `}</style>

        {/* ── INFO AREA ── */}
        <div style={{ padding: '18px 18px 20px', background: '#F2EFEB' }}>
          <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', marginBottom: '14px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{
              fontFamily: 'var(--font)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.18em', color: '#0a0a0a', lineHeight: 1.3, flex: 1,
              textTransform: 'uppercase',
            }}>
              {product.name}
            </p>
            {/* Added confirmation */}
            <AnimatePresence>
              {justAdded && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit   ={{ opacity: 0    }}
                  transition={{ duration: 0.3 }}
                  style={{ fontFamily: 'var(--font)', fontSize: '8px', letterSpacing: '0.3em', color: 'rgba(0,0,0,0.45)', whiteSpace: 'nowrap', marginLeft: '8px', marginTop: '2px' }}
                >
                  {justAdded} ADDED
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <p style={{
              fontFamily: 'var(--font)', fontSize: '11px', fontWeight: 400,
              letterSpacing: '0.12em', color: 'rgba(0,0,0,0.45)',
            }}>
              {product.price}
            </p>
            <span style={{
              fontFamily: 'var(--font)', fontSize: '8px', letterSpacing: '0.3em',
              color: 'rgba(0,0,0,0.22)',
            }}>{product.tag}</span>
          </div>
        </div>

        {/* Hover border */}
        <motion.div
          style={{ position: 'absolute', inset: 0, border: '1px solid rgba(0,0,0,0.22)', pointerEvents: 'none', zIndex: 10 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
}
