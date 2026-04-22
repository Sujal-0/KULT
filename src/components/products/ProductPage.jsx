import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { MENS_PRODUCTS, WOMENS_PRODUCTS } from './data'
import ProductCard from './ProductCard'

const EASE     = [0.76, 0, 0.24, 1]
const EASE_OUT = [0.16, 1, 0.3, 1]
const GAP      = 24   // gap between cards (px)

/* ─── Arrow button ─────────────────────────────────────────── */
function ArrowBtn({ dir, onClick, disabled }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      data-cursor-hover
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      disabled={disabled}
      style={{
        width         : '44px',
        height        : '44px',
        border        : `1px solid rgba(242,239,235,${disabled ? 0.08 : 0.25})`,
        background    : hov && !disabled ? 'rgba(242,239,235,0.06)' : 'transparent',
        cursor        : disabled ? 'default' : 'none',
        display       : 'flex',
        alignItems    : 'center',
        justifyContent: 'center',
        color         : `rgba(242,239,235,${disabled ? 0.18 : 1})`,
        fontFamily    : 'var(--font)',
        fontSize      : '14px',
        transition    : 'all 0.25s ease',
        borderRadius  : '2px',
        flexShrink    : 0,
      }}
    >
      {dir === 'left' ? '←' : '→'}
    </button>
  )
}

/* ─── PRODUCT PAGE ──────────────────────────────────────────── */
export default function ProductPage({ gender, onBack, onProductSelect }) {
  const isMens   = gender === 'mens'
  const products = isMens ? MENS_PRODUCTS : WOMENS_PRODUCTS
  const label    = isMens ? 'MNS' : 'WMNS'

  /* ── Window width → responsive carousel values ── */
  const [winW, setWinW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Cards visible at once: 1 mobile / 2 tablet / 3 desktop */
  const visibleCount = winW < 768 ? 1 : winW < 1100 ? 2 : 3

  /* Sidebar width (collapses to 0 on mobile when it goes to top) */
  const sidebarW = winW >= 768
    ? Math.min(Math.max(winW * 0.22, 200), 280)
    : 0

  /* Horizontal padding inside the carousel container (matches header padding) */
  const PADDING_H = winW < 768 ? 40 : 96
  const availW    = winW - sidebarW - PADDING_H

  /* Card width — fills available space evenly per visibleCount */
  const CARD_W =
    visibleCount === 3
      ? Math.max(Math.floor((availW - 2 * GAP) / 3), 200)
      : visibleCount === 2
        ? Math.max(Math.floor((availW - GAP) / 2), 180)
        : Math.min(Math.round(availW * 0.88), 340)

  /* Image height — fixed heights so cards never overflow the viewport */
  const IMG_H = visibleCount === 1 ? 250 : visibleCount === 2 ? 300 : 320

  /* Carousel geometry */
  const TRACK_VIEW_W  = visibleCount * CARD_W + (visibleCount - 1) * GAP
  const ONE_PAGE_W    = visibleCount * CARD_W + visibleCount * GAP
  const totalPages    = Math.ceil(products.length / visibleCount)
  const MAX_DRAG_LEFT = -((totalPages - 1) * ONE_PAGE_W)

  const [pageIdx,     setPageIdx]     = useState(0)
  const [backHovered, setBackHovered] = useState(false)

  const xMotion = useMotionValue(0)

  /* Reset carousel when screen size changes breakpoint category */
  useEffect(() => {
    setPageIdx(0)
    animate(xMotion, 0, { duration: 0.01 })
  }, [visibleCount]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Drive track x from pageIdx */
  useEffect(() => {
    animate(xMotion, -(pageIdx * ONE_PAGE_W), {
      duration: 0.75,
      ease    : EASE,
    })
  }, [pageIdx, ONE_PAGE_W]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragEnd = (_, info) => {
    const dragged = info.offset.x
    let target = pageIdx
    if (dragged < -40 && pageIdx < totalPages - 1) target = pageIdx + 1
    if (dragged >  40 && pageIdx > 0)              target = pageIdx - 1
    setPageIdx(target)
    animate(xMotion, -(target * ONE_PAGE_W), { duration: 0.55, ease: EASE })
  }

  const goNext = () => { if (pageIdx < totalPages - 1) setPageIdx(p => p + 1) }
  const goPrev = () => { if (pageIdx > 0)              setPageIdx(p => p - 1) }

  return (
    <div
      className="product-page-root"
      style={{
        position  : 'relative',
        display   : 'flex',
        minHeight : '100svh',
        background: '#000',
      }}
    >
      {/* ════════════════════════════════════════
          LEFT SIDEBAR — off-white
      ════════════════════════════════════════ */}
      <div
        className="product-page-sidebar"
        style={{
          position      : 'relative',
          zIndex        : 1,
          width         : '22vw',
          minWidth      : '200px',
          maxWidth      : '280px',
          flexShrink    : 0,
          background    : '#F2EFEB',
          display       : 'flex',
          flexDirection : 'column',
          justifyContent: 'space-between',
          padding       : '96px 0 0 0',
          borderRight   : '1px solid rgba(0,0,0,0.08)',
          overflow      : 'hidden',
        }}
      >
        {/* Top content */}
        <div style={{ padding: '0 32px' }}>
          {/* Season tag */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 }}
            style={{
              fontFamily   : 'var(--font)',
              fontSize     : '9px',
              letterSpacing: '0.45em',
              color        : 'rgba(0,0,0,0.32)',
              marginBottom : '28px',
            }}
          >
            SS 26 / KULT
          </motion.p>

          {/* Large MNS / WMNS — clipPath reveal */}
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%',   opacity: 1 }}
              transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.35 }}
              style={{
                fontFamily   : 'var(--font)',
                fontSize     : 'clamp(40px, 4vw, 70px)',
                fontWeight   : 900,
                letterSpacing: '0.06em',
                lineHeight   : 1,
                color        : '#0a0a0a',
                marginBottom : '24px',
              }}
            >
              {label}
            </motion.h1>
          </div>

          {/* Thin rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.5 }}
            style={{
              height         : '1px',
              background     : 'rgba(0,0,0,0.1)',
              transformOrigin: 'left center',
              marginBottom   : '20px',
            }}
          />

          {/* Piece count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              fontFamily   : 'var(--font)',
              fontSize     : '9px',
              letterSpacing: '0.35em',
              color        : 'rgba(0,0,0,0.38)',
            }}
          >
            {products.length} PIECES
          </motion.p>
        </div>

        {/* ── BACK button ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          style={{ position: 'relative', width: '100%' }}
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
        >
          <motion.div
            style={{
              position  : 'absolute',
              inset     : 0,
              background: '#0a0a0a',
              zIndex    : 0,
            }}
            animate={{ x: backHovered ? '0%' : '-101%' }}
            transition={{ duration: 0.42, ease: EASE }}
          />
          <button
            data-cursor-hover
            onClick={onBack}
            style={{
              position     : 'relative',
              zIndex       : 1,
              display      : 'flex',
              alignItems   : 'center',
              gap          : '12px',
              width        : '100%',
              padding      : '20px 32px',
              background   : 'transparent',
              border       : 'none',
              borderTop    : '1px solid rgba(0,0,0,0.1)',
              outline      : 'none',
              cursor       : 'none',
              fontFamily   : 'var(--font)',
              fontSize     : '11px',
              fontWeight   : 700,
              letterSpacing: '0.35em',
              color        : backHovered ? '#F2EFEB' : 'rgba(0,0,0,0.45)',
              transition   : 'color 0.25s ease',
              textAlign    : 'left',
            }}
          >
            <span style={{ fontSize: '14px' }}>←</span>
            BACK
          </button>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT AREA — responsive carousel
      ════════════════════════════════════════ */}
      <div
        className="product-page-main"
        style={{
          position     : 'relative',
          zIndex       : 1,
          flex         : 1,
          display      : 'flex',
          flexDirection: 'column',
          padding      : '96px 0 48px 0',
          minWidth     : 0,
        }}
      >
        {/* ── Header row ── */}
        <motion.div
          className="product-page-header-row"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.3 }}
          style={{
            display        : 'flex',
            justifyContent : 'space-between',
            alignItems     : 'center',
            padding        : '0 48px',
            marginBottom   : '40px',
          }}
        >
          <span
            style={{
              fontFamily   : 'var(--font)',
              fontSize     : '9px',
              letterSpacing: '0.45em',
              color        : 'rgba(242,239,235,0.28)',
            }}
          >
            {label} — {String(pageIdx * visibleCount + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <ArrowBtn dir="left"  onClick={goPrev} disabled={pageIdx === 0}             />
            <ArrowBtn dir="right" onClick={goNext} disabled={pageIdx >= totalPages - 1} />
          </div>
        </motion.div>

        {/* ── Carousel viewport ── */}
        <div
          className="product-page-carousel-container"
          style={{
            flex          : 1,
            display       : 'flex',
            alignItems    : 'flex-end',   /* bottom-anchor cards on desktop */
            padding       : '0 48px',     /* match header left/right padding */
            overflow      : 'hidden',
          }}
        >
          <div
            className="product-page-carousel-viewport"
            style={{
              width     : '100%',           /* fill the padded area fully */
              overflow  : 'hidden',
              userSelect: 'none',
            }}
          >
            {/* Track — draggable */}
            <motion.div
              drag="x"
              dragConstraints={{ left: MAX_DRAG_LEFT, right: 0 }}
              dragElastic={0.06}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              style={{
                x      : xMotion,
                display: 'flex',
                gap    : `${GAP}px`,
                cursor : 'grab',
                alignItems: 'flex-end',   /* keep card bottoms flush */
              }}
              whileDrag={{ cursor: 'grabbing' }}
            >
              {products.map((product, i) => (
                <div key={product.id} style={{ flexShrink: 0 }}>
                  <ProductCard
                    product={product}
                    index={i % visibleCount}
                    onProductSelect={onProductSelect}
                    cardWidth={CARD_W}
                    imageHeight={IMG_H}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Page dots ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            display       : 'flex',
            justifyContent: 'center',
            gap           : '6px',
            paddingTop    : '28px',
          }}
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width     : i === pageIdx ? 20 : 4,
                background: i === pageIdx
                  ? 'rgba(242,239,235,0.8)'
                  : 'rgba(242,239,235,0.2)',
              }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              style={{ height: '2px', borderRadius: '1px', cursor: 'none' }}
              onClick={() => setPageIdx(i)}
              data-cursor-hover
            />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .product-page-root {
            height: 100svh;
            overflow: hidden;
          }
          .product-page-main {
            overflow: hidden;
          }
          .product-page-carousel-container {
            min-height: 0;
          }
        }

        @media (max-width: 768px) {
          .product-page-root {
            flex-direction: column;
            min-height: 100svh;
          }
          .product-page-sidebar {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            padding-top: 56px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(0,0,0,0.08);
          }
          .product-page-main {
            width: 100%;
            min-width: 0;
            padding-top: 16px !important;
            padding-bottom: 24px !important;
          }
          .product-page-header-row {
            padding: 0 20px !important;
            margin-bottom: 20px !important;
          }
          .product-page-carousel-container {
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
          }
          .product-page-carousel-viewport {
            width: auto !important;
          }
        }
      `}</style>
    </div>
  )
}
