import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'

/* ── Eases ── */
const EASE = [0.76, 0, 0.24, 1]
const EASE_OUT = [0.16, 1, 0.3, 1]

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

const DESC_LINES = [
  'A study in restraint. Cut from heavyweight premium cotton — oversized silhouettes designed to move with the wearer through season and time.',
  'Limited seasonal release. Garment-dyed finish. Minimal branding. Built to outlast the moment it was made for.',
]
const DETAILS = [
  ['MATERIAL', '100% Heavyweight Cotton'],
  ['FIT', 'Oversized / Relaxed'],
  ['ORIGIN', 'Made In India'],
  ['CARE', 'Cold wash — Hang dry.'],
]

/* ─── Text reveal helper ─────────────────────────────────────── */
function Reveal({ children, delay = 0, triggered }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={triggered ? { y: '0%', opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ─── BUY NOW button with vertical text swap ─────────────────── */
function BuyNowButton({ onBuy }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      data-cursor-hover
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onBuy}
      style={{
        width: '100%',
        height: '48px',
        background: '#0a0a0a',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.span
        animate={{ y: hov ? '-110%' : '0%', opacity: hov ? 0 : 1 }}
        transition={{ duration: 0.32, ease: EASE }}
        style={{
          position: 'absolute',
          fontFamily: 'var(--font)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.4em',
          color: '#F2EFEB',
        }}
      >
        BUY NOW
      </motion.span>

      <motion.span
        animate={{ y: hov ? '0%' : '110%', opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.32, ease: EASE }}
        style={{
          position: 'absolute',
          fontFamily: 'var(--font)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.4em',
          color: '#F2EFEB',
        }}
      >
        BUY NOW
      </motion.span>
    </div>
  )
}

/* ─── IMAGE FLIP SCENE (desktop hover split) ─────────────────── */
function ImageFlipScene({ images, activeIdx, totalImages, product, onIndexChange }) {
  const [hovSide, setHovSide] = useState(null) // 'left' | 'right' | null

  const prevIdx = activeIdx > 0 ? activeIdx - 1 : null
  const nextIdx = activeIdx < totalImages - 1 ? activeIdx + 1 : null

  const hasPrev = prevIdx !== null
  const hasNext = nextIdx !== null

  const flipClass =
    hovSide === 'left' && hasPrev ? 'flip-left'
    : hovSide === 'right' && hasNext ? 'flip-right'
    : 'flip-none'

  return (
    <div className="pd-flip-scene">
      {/* ── Card with subtle 3-D tilt on hover ── */}
      <div className={`pd-flip-card ${flipClass}`}>

        {/* Base image face */}
        <div className="pd-flip-face">
          <img src={images[activeIdx]} alt={product.name} />
        </div>

        {/* Peek image — LEFT side reveals prev angle */}
        {hasPrev && (
          <div className={`pd-peek-img pd-peek-img--left ${hovSide === 'left' ? 'active' : ''}`}>
            <img src={images[prevIdx]} alt={product.name} />
          </div>
        )}

        {/* Peek image — RIGHT side reveals next angle */}
        {hasNext && (
          <div className={`pd-peek-img pd-peek-img--right ${hovSide === 'right' ? 'active' : ''}`}>
            <img src={images[nextIdx]} alt={product.name} />
          </div>
        )}
      </div>

      {/* ── Invisible hover zones (on top of everything) ── */}
      {hasPrev && (
        <div
          className="pd-hover-zone pd-hover-zone--left product-detail-desktop-only"
          onMouseEnter={() => setHovSide('left')}
          onMouseLeave={() => setHovSide(null)}
          onClick={() => onIndexChange(prevIdx)}
        />
      )}
      {hasNext && (
        <div
          className="pd-hover-zone pd-hover-zone--right product-detail-desktop-only"
          onMouseEnter={() => setHovSide('right')}
          onMouseLeave={() => setHovSide(null)}
          onClick={() => onIndexChange(nextIdx)}
        />
      )}

      {/* ── Subtle directional hints ── */}
      {hasPrev && (
        <div className="pd-hover-hint pd-hover-hint--left product-detail-desktop-only">
          <span className="pd-hover-hint-arrow">←</span>
          <span className="pd-hover-hint-label">PREV</span>
        </div>
      )}
      {hasNext && (
        <div className="pd-hover-hint pd-hover-hint--right product-detail-desktop-only">
          <span className="pd-hover-hint-arrow">→</span>
          <span className="pd-hover-hint-label">NEXT</span>
        </div>
      )}

      {/* ── Centre divider line (appears on hover) ── */}
      {(hasPrev || hasNext) && (
        <div className="pd-center-divider product-detail-desktop-only" />
      )}
    </div>
  )
}

/* ─── PRODUCT DETAIL PAGE ────────────────────────────────────── */
export default function ProductDetail({ product, onBack, onOpenCart }) {
  if (!product) return null

  const rawImages = [
    product.image,
    product.altA || product.image,
    product.altB || product.image,
  ]
  const images = rawImages.filter((img, idx, arr) => arr.indexOf(img) === idx)
  const totalImages = images.length

  const [activeIdx, setActiveIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [indexHovered, setIndexHovered] = useState(false)
  const [productsHovered, setProductsHovered] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [sizeError, setSizeError] = useState(false)

  const { addItem } = useCart()


  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 820)
      return
    }
    addItem(product, selectedSize)
    onOpenCart?.()
  }

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 400)
    const onWheel = (e) => {
      if (e.deltaY > 0) { setRevealed(true); clearTimeout(timer) }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div
      className="product-detail-root"
      style={{
        height: '100svh',
        boxSizing: 'border-box',
        paddingTop: '72px',
        background: '#F2EFEB',
        display: 'grid',
        gridTemplateColumns: '200px 1fr 300px',
        gridTemplateRows: '1fr',
        fontFamily: 'var(--font)',
      }}
    >

      {/* ══════════════════════════════════════
          LEFT SIDEBAR
      ══════════════════════════════════════ */}
      <motion.div
        className="product-detail-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
        style={{
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(0,0,0,0.07)',
          overflow: 'hidden',
        }}
      >
        {/* Top section */}
        <div style={{ padding: '40px 28px 0 0' }}>

          {/* ← PRODUCTS */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              marginBottom: '52px',
            }}
            onMouseEnter={() => setProductsHovered(true)}
            onMouseLeave={() => setProductsHovered(false)}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#0a0a0a',
                zIndex: 0,
              }}
              animate={{ x: productsHovered ? '0%' : '-101%' }}
              transition={{ duration: 0.42, ease: EASE }}
            />
            <button
              data-cursor-hover
              onClick={onBack}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 28px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.45em',
                color: productsHovered ? '#F2EFEB' : 'rgba(0,0,0,0.35)',
                transition: 'color 0.25s ease',
                textAlign: 'left',
              }}
            >
              ← PRODUCTS
            </button>
          </div>

          {/* Image index */}
          <div
            className="product-detail-index-wrap"
            style={{ padding: '0 28px' }}
            onMouseEnter={() => setIndexHovered(true)}
            onMouseLeave={() => setIndexHovered(false)}
          >
            <p style={{
              fontFamily: 'var(--font)',
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.28em',
              color: '#0a0a0a',
              marginBottom: '18px',
              lineHeight: 1,
            }}>
              {String(activeIdx + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
            </p>

            <div className="product-detail-index-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {images.map((_, i) => {
                const isActive = activeIdx === i
                return (
                  <motion.button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    data-cursor-hover
                    animate={{
                      opacity: isActive ? 1 : indexHovered ? 0.55 : 0.2,
                      color: isActive ? '#0a0a0a' : 'rgba(0,0,0,0.5)',
                    }}
                    whileHover={{ opacity: 1, color: '#0a0a0a' }}
                    transition={{ duration: 0.25 }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font)',
                      fontSize: '11px',
                      fontWeight: isActive ? 700 : 400,
                      letterSpacing: '0.25em',
                      color: isActive ? '#0a0a0a' : 'rgba(0,0,0,0.2)',
                      textAlign: 'left',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <motion.span
                      style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '1px',
                        background: '#0a0a0a',
                        flexShrink: 0,
                      }}
                      animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: 0.25 }}
                    />
                    {String(i + 1).padStart(2, '0')}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>{/* end top section */}

        {/* Bottom: Size selector */}
        <div style={{ padding: '0 28px 40px 28px' }}>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.45em',
            color: sizeError ? '#c0392b' : 'rgba(0,0,0,0.35)',
            marginBottom: '12px',
            transition: 'color 0.2s ease',
          }}>
            SIZE
          </p>

          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {SIZES.map((size) => {
              const active = selectedSize === size
              return (
                <motion.button
                  key={size}
                  onClick={() => setSelectedSize(active ? null : size)}
                  data-cursor-hover
                  animate={{
                    background: active ? '#0a0a0a' : 'transparent',
                    color: active ? '#F2EFEB' : '#0a0a0a',
                    borderColor: active
                      ? '#0a0a0a'
                      : sizeError
                        ? 'rgba(192,57,43,0.5)'
                        : 'rgba(0,0,0,0.18)',
                  }}
                  whileHover={!active ? {
                    background: '#0a0a0a',
                    color: '#F2EFEB',
                    borderColor: '#0a0a0a',
                  } : {}}
                  transition={{ duration: 0.18, ease: EASE }}
                  style={{
                    padding: '7px 9px',
                    border: '1px solid rgba(0,0,0,0.18)',
                    fontFamily: 'var(--font)',
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    outline: 'none',
                    borderRadius: '2px',
                    minWidth: '34px',
                    textAlign: 'center',
                  }}
                >
                  {size}
                </motion.button>
              )
            })}
          </div>

          {/* Size error toast */}
          <AnimatePresence>
            {sizeError && (
              <motion.div
                key="size-error"
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                style={{ overflow: 'hidden', marginTop: '10px' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  background: 'rgba(192,57,43,0.07)',
                  border: '1px solid rgba(192,57,43,0.2)',
                  borderLeft: '3px solid #c0392b',
                  borderRadius: '2px',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span style={{
                    fontFamily: 'var(--font)',
                    fontSize: '8px',
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    color: '#c0392b',
                  }}>
                    CHOOSE YOUR SIZE
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>{/* end bottom size section */}

      </motion.div>{/* end LEFT SIDEBAR */}


      {/* ══════════════════════════════════════
          CENTER — MAIN IMAGE
      ══════════════════════════════════════ */}
      <motion.div
        className="product-detail-center"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.05 }}
        onPanEnd={(_, info) => {
          const dx = info.offset.x
          const dy = info.offset.y
          if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return
          if (dx < 0) setActiveIdx(p => Math.min(p + 1, totalImages - 1))
          else        setActiveIdx(p => Math.max(p - 1, 0))
        }}
        style={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid rgba(0,0,0,0.07)',
          background: '#E8E5E1',
          touchAction: 'pan-y',
          perspective: '1200px',
        }}
      >
        {/* ── Flip card scene ─────────────────────────────────────── */}
        <ImageFlipScene
          images={images}
          activeIdx={activeIdx}
          totalImages={totalImages}
          product={product}
          onIndexChange={setActiveIdx}
        />

        <span style={{
          position: 'absolute',
          bottom: '20px',
          left: '24px',
          fontFamily: 'var(--font)',
          fontSize: '8px',
          letterSpacing: '0.4em',
          color: 'rgba(0,0,0,0.18)',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          KULT / SS 26
        </span>

        {/* ── Mobile-only image index (01/02 + dots) ── */}
        <div
          className="product-detail-mobile-index"
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            zIndex: 2,
            display: 'none',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
          }}
        >
          <span style={{
            fontFamily: 'var(--font)',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '0.28em',
            color: 'rgba(0,0,0,0.45)',
            lineHeight: 1,
          }}>
            {String(activeIdx + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
          </span>
          <div style={{ display: 'flex', gap: '5px' }}>
            {images.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveIdx(i)}
                animate={{ scale: activeIdx === i ? 1.2 : 1, opacity: activeIdx === i ? 1 : 0.35 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: '#0a0a0a',
                  border: 'none', outline: 'none', cursor: 'pointer', padding: 0,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile swipe arrows ── */}
        {activeIdx > 0 && (
          <motion.button
            className="product-detail-swipe-arrow product-detail-swipe-arrow--left"
            onClick={() => setActiveIdx(p => p - 1)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'none',
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 4,
              background: 'rgba(242,239,235,0.80)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font)',
              fontSize: '14px',
              color: '#0a0a0a',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            &#8592;
          </motion.button>
        )}
        {activeIdx < totalImages - 1 && (
          <motion.button
            className="product-detail-swipe-arrow product-detail-swipe-arrow--right"
            onClick={() => setActiveIdx(p => p + 1)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'none',
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 4,
              background: 'rgba(242,239,235,0.80)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font)',
              fontSize: '14px',
              color: '#0a0a0a',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            &#8594;
          </motion.button>
        )}
      </motion.div>{/* end CENTER */}


      {/* ══════════════════════════════════════
          RIGHT SIDEBAR
      ══════════════════════════════════════ */}
      <motion.div
        className="product-detail-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 }}
        style={{
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px 36px 40px 36px',
          overflowY: 'auto',
        }}
      >
        {/* Top: tabs + content */}
        <div>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '28px',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            paddingBottom: '14px',
            marginBottom: '32px',
          }}>
            {[['description', 'DESCRIPTION'], ['details', 'DETAILS']].map(([key, label]) => {
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  data-cursor-hover
                  onClick={() => setActiveTab(key)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                    fontSize: '9px',
                    fontWeight: isActive ? 700 : 400,
                    letterSpacing: '0.4em',
                    color: isActive ? '#0a0a0a' : 'rgba(0,0,0,0.22)',
                    padding: '0 0 14px 0',
                    marginBottom: '-15px',
                    borderBottom: isActive ? '1px solid #0a0a0a' : '1px solid transparent',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'description' ? (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              >
                <Reveal delay={0.05} triggered={revealed}>
                  <h2 style={{
                    fontFamily: 'var(--font)',
                    fontSize: 'clamp(16px, 1.6vw, 24px)',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    color: '#0a0a0a',
                    lineHeight: 1.1,
                    marginBottom: '18px',
                  }}>
                    {product.name}
                  </h2>
                </Reveal>

                {DESC_LINES.map((line, i) => (
                  <Reveal key={i} delay={0.15 + i * 0.1} triggered={revealed}>
                    <p style={{
                      fontFamily: 'var(--font)',
                      fontSize: '11px',
                      fontWeight: 400,
                      letterSpacing: '0.04em',
                      color: 'rgba(0,0,0,0.5)',
                      lineHeight: 1.75,
                      marginBottom: '14px',
                    }}>
                      {line}
                    </p>
                  </Reveal>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              >
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', marginBottom: '20px' }} />

                {DETAILS.map(([key, val], i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT, delay: i * 0.07 }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font)',
                      fontSize: '8px',
                      letterSpacing: '0.4em',
                      color: 'rgba(0,0,0,0.35)',
                    }}>
                      {key}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font)',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      color: '#0a0a0a',
                      fontWeight: 500,
                    }}>
                      {val}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>{/* end top tabs+content */}

        {/* Bottom: Price + BUY NOW */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.62 }}
        >
          <span style={{
            fontFamily: 'var(--font)',
            fontSize: '8px',
            letterSpacing: '0.45em',
            color: 'rgba(0,0,0,0.3)',
            display: 'block',
            marginBottom: '8px',
          }}>
            {product.tag}
          </span>
          <div style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(26px, 2.6vw, 40px)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: '#0a0a0a',
            lineHeight: 1,
            marginBottom: '22px',
          }}>
            {product.price}
          </div>
          {/* Mobile-only size error — above BUY NOW, hidden on desktop */}
          <div className="product-detail-mobile-error-wrap">
            <AnimatePresence>
              {sizeError && (
                <motion.div
                  key="mob-size-error"
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  style={{ overflow: 'hidden', marginBottom: '10px' }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 12px',
                    background: 'rgba(192,57,43,0.07)',
                    border: '1px solid rgba(192,57,43,0.2)',
                    borderLeft: '3px solid #c0392b',
                    borderRadius: '2px',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span style={{
                      fontFamily: 'var(--font)', fontSize: '8px', fontWeight: 700,
                      letterSpacing: '0.35em', color: '#c0392b',
                    }}>
                      CHOOSE YOUR SIZE
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <BuyNowButton onBuy={handleBuyNow} />
        </motion.div>

      </motion.div>{/* end RIGHT SIDEBAR */}

      <style>{`
        /* ── Flip card 3D styles ── */
        .pd-flip-scene {
          position: absolute;
          inset: 0;
          perspective: 1200px;
        }
        .pd-flip-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.76, 0, 0.24, 1);
          will-change: transform;
        }
        .pd-flip-card.flip-left  { transform: rotateY(-12deg); }
        .pd-flip-card.flip-right { transform: rotateY(12deg); }
        .pd-flip-card.flip-none  { transform: rotateY(0deg); }

        /* Front face = base image */
        .pd-flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
        }
        .pd-flip-face img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          padding: 40px;
          box-sizing: border-box;
          transition: opacity 0.38s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1);
        }

        /* Hover zone overlays */
        .pd-hover-zone {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          z-index: 10;
          cursor: none;
        }
        .pd-hover-zone--left  { left: 0; }
        .pd-hover-zone--right { right: 0; }

        /* Peek image (revealed on hover via clip-path) */
        .pd-peek-img {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 5;
        }
        .pd-peek-img img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          padding: 40px;
          box-sizing: border-box;
          display: block;
        }
        /* Clip reveals from left */
        .pd-peek-img--left {
          clip-path: inset(0 100% 0 0);
          transition: clip-path 0.52s cubic-bezier(0.16,1,0.3,1);
        }
        .pd-peek-img--left.active {
          clip-path: inset(0 50% 0 0);
        }
        /* Clip reveals from right */
        .pd-peek-img--right {
          clip-path: inset(0 0 0 100%);
          transition: clip-path 0.52s cubic-bezier(0.16,1,0.3,1);
        }
        .pd-peek-img--right.active {
          clip-path: inset(0 0 0 50%);
        }

        /* Subtle arrow hint labels */
        .pd-hover-hint {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 11;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .pd-hover-hint--left  { left: 18px; }
        .pd-hover-hint--right { right: 18px; }
        .pd-hover-zone--left:hover  ~ .pd-hover-hint--left,
        .pd-hover-zone--right:hover ~ .pd-hover-hint--right { opacity: 1; }
        .pd-hover-hint-arrow {
          font-family: var(--font);
          font-size: 18px;
          color: rgba(0,0,0,0.3);
          line-height: 1;
        }
        .pd-hover-hint-label {
          font-family: var(--font);
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.35em;
          color: rgba(0,0,0,0.25);
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        /* Divider line in centre of image area */
        .pd-center-divider {
          position: absolute;
          top: 15%;
          bottom: 15%;
          left: 50%;
          width: 1px;
          background: rgba(0,0,0,0.07);
          z-index: 8;
          pointer-events: none;
          transform: scaleY(0);
          transform-origin: center;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .product-detail-center:hover .pd-center-divider {
          transform: scaleY(1);
        }

        /* Hide flip hover elements on mobile — touch uses swipe */
        @media (max-width: 768px) {
          .product-detail-desktop-only {
            display: none !important;
          }
        }

        /* Mobile-only elements hidden by default on desktop */
        .product-detail-mobile-error-wrap {
          display: none;
        }

        @media (max-width: 768px) {
          .product-detail-root {
            height: auto !important;
            min-height: 100svh;
            display: grid !important;
            grid-template-columns: 1fr !important;
            grid-template-rows: auto auto auto !important;
            overflow-x: hidden;
          }

          .product-detail-center {
            order: 1;
            height: 52svh !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(0,0,0,0.07);
          }

          /* Show mobile image index inside the image panel */
          .product-detail-mobile-index {
            display: flex !important;
          }

          /* Show swipe arrow hints on mobile */
          .product-detail-swipe-arrow {
            display: flex !important;
          }

          .product-detail-right {
            order: 2;
            height: auto !important;
            padding: 20px 16px !important;
            overflow: visible !important;
          }

          /* Show mobile size error above BUY NOW */
          .product-detail-mobile-error-wrap {
            display: block;
          }

          .product-detail-left {
            order: 3;
            height: auto !important;
            border-right: none !important;
            border-top: 1px solid rgba(0,0,0,0.07);
          }

          /* Hide image index from left sidebar on mobile (shown inside image instead) */
          .product-detail-index-wrap {
            display: none !important;
          }

          .product-detail-index-list {
            flex-direction: row !important;
            flex-wrap: wrap;
            gap: 14px !important;
          }

          .product-detail-left > div:first-child {
            padding: 20px 0 0 0 !important;
          }

          .product-detail-left > div:last-child {
            padding: 0 16px 20px 16px !important;
          }
        }
      `}</style>

    </div>
  )
}