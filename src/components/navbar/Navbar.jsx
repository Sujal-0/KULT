import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SlideButton from '../ui/SlideButton'
import MenuOverlay from './MenuOverlay'
import { useCart } from '../../context/CartContext'

const EASE     = [0.76, 0, 0.24, 1]
const EASE_OUT = [0.16, 1, 0.3, 1]

function scrollTo(id, duration = 1.4) {
  const el = document.getElementById(id)
  if (!el) return false
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { duration, easing: t => 1 - Math.pow(1 - t, 4) })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
  return true
}

/* ── Cart count badge ──────────────────────────────────────────────
   FIX 1 — "BASKET" label now uses the same vertical text-swap
            transition as every other button in the project.

   FIX 2 — When isProductPage=true the navbar sits over an off-white
            (#F2EFEB) background. The count box and label must be dark
            so they remain readable. We receive `onDark` as a prop:
              • onDark=true  → black bg box, dark label (hero/home = black bg)
              • onDark=false → black bg box is fine but label must be dark too
                               (product/cart pages have off-white backgrounds)

   Wait — actually the count BOX is always #0a0a0a (dark), which is
   fine on BOTH backgrounds. The only thing that changes is the
   BASKET text and mobile responsiveness.

   On desktop over dark bg  (home)            → label color: var(--text) = #F2EFEB ✓
   On desktop over off-white (product/cart)   → label color: #0a0a0a              ✓
   On mobile  (navbar always over off-white)  → label color: #0a0a0a              ✓

   We handle this with a prop `labelDark` passed from Navbar.
─────────────────────────────────────────────────────────────────── */
function CartBadge({ count, onClick, labelDark = false }) {
  const [hov, setHov] = useState(false)

  /* Label color — dark on off-white bg, light on dark bg */
  const labelColor = labelDark ? '#0a0a0a' : 'var(--text)'

  return (
    <>
      <style>{`
        /* Mobile/tablet — navbar floats over off-white content, force dark label */
        @media (max-width: 1023px) {
          .kult-badge-label { color: #0a0a0a !important; }
        }
      `}</style>

      <button
        data-cursor-hover
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display   : 'flex',
          alignItems: 'center',
          gap       : '10px',
          background: 'transparent',
          border    : 'none',
          outline   : 'none',
          cursor    : 'pointer',
          marginRight: '12px',
        }}
      >
        {/* ── Count box — always dark ── */}
        <div
          style={{
            background    : '#0a0a0a',
            padding       : '5px 10px',
            overflow      : 'hidden',
            position      : 'relative',
            minWidth      : '34px',
            height        : '26px',
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
            borderRadius  : '2px',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%',   opacity: 1 }}
              exit   ={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              style={{
                fontFamily   : 'var(--font)',
                fontSize     : '10px',
                fontWeight   : 700,
                letterSpacing: '0.15em',
                color        : '#F2EFEB',
                position     : 'absolute',
              }}
            >
              {String(count).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── "BASKET" — vertical text-swap transition (same as BUY NOW) ── */}
        <span
          className="kult-badge-label"
          style={{
            position  : 'relative',
            overflow  : 'hidden',
            height    : '1em',
            display   : 'flex',
            alignItems: 'center',
            color     : labelColor,
          }}
        >
          {/* Visible label — slides UP out on hover */}
          <motion.span
            animate={{ y: hov ? '-110%' : '0%', opacity: hov ? 0 : 1 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{
              display      : 'block',
              position     : 'absolute',
              fontFamily   : 'var(--font)',
              fontSize     : '9px',
              fontWeight   : 700,
              letterSpacing: '0.4em',
              whiteSpace   : 'nowrap',
            }}
          >
            BASKET
          </motion.span>

          {/* Duplicate — rises in from below on hover */}
          <motion.span
            animate={{ y: hov ? '0%' : '110%', opacity: hov ? 1 : 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{
              display      : 'block',
              position     : 'absolute',
              fontFamily   : 'var(--font)',
              fontSize     : '9px',
              fontWeight   : 700,
              letterSpacing: '0.4em',
              whiteSpace   : 'nowrap',
            }}
          >
            BASKET
          </motion.span>

          {/* Invisible sizer so the button has correct width */}
          <span
            aria-hidden
            style={{
              visibility   : 'hidden',
              fontFamily   : 'var(--font)',
              fontSize     : '9px',
              fontWeight   : 700,
              letterSpacing: '0.4em',
              whiteSpace   : 'nowrap',
            }}
          >
            BASKET
          </span>
        </span>
      </button>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────
   NAVBAR
─────────────────────────────────────────────────────────────────── */
export default function Navbar({
  isProductPage    = false,   // off-white bg pages (product, cart, detail)
  hideActionButton = false,
  hideCartBadge    = false,   // true on hero/main page — hides counter + BASKET
  cartLabelDark    = false,   // true = dark BASKET text (off-white bg), false = light (dark bg)
  hamburgerLight   = null,    // true=always light | false=always dark | null=desktop-light/mobile-dark
  onNavigateTo,
  onOpenCart,
  onBack,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalCount } = useCart()

  const openMenu  = () => setMenuOpen(true)
  const closeMenu = () => {
    setMenuOpen(false)
    setTimeout(() => scrollTo('hero', 1.5), 650)
  }

  const showActionButton = !hideActionButton && (!isProductPage || totalCount === 0)

  /*
   * Hamburger / X colour logic:
   *  - menuOpen=true       → always #F2EFEB (X sits over black overlay)
   *  - hamburgerLight=true  → always #F2EFEB (hero — dark bg on all screens)
   *  - hamburgerLight=false → always #0a0a0a (detail/cart — off-white bg)
   *  - hamburgerLight=null  → #F2EFEB desktop (dark bg), dark forced on mobile via CSS
   */
  const hamDesktopColor = hamburgerLight === false ? '#0a0a0a' : '#F2EFEB'
  const hamAnimColor    = menuOpen ? '#F2EFEB' : hamDesktopColor
  // Mobile-dark class: active only when menu closed AND not always-light (hero)
  const hamMobileClass  = !menuOpen && hamburgerLight !== true ? 'kult-hamburger-mobile-dark' : ''

  const handleLogoClick = () => {
    const found = scrollTo('hero', 1.4)
    if (!found && onNavigateTo) {
      onNavigateTo('hero')
      setTimeout(() => scrollTo('hero', 1.2), 480)
    }
  }

  return (
    <>
      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigateTo={onNavigateTo}
      />

      {/* Hamburger mobile-dark: forces dark on small screens when menu is closed */}
      <style>{`
        @media (max-width: 1023px) {
          .kult-hamburger-mobile-dark { color: #0a0a0a !important; }
        }
      `}</style>

      <motion.nav
        style={{
          position  : 'fixed',
          top       : 0,
          left      : 0,
          right     : 0,
          zIndex    : 200,
          display   : 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          alignItems: 'center',
          paddingRight: '32px',
          fontFamily: 'var(--font)',
          color     : 'var(--text)',
          height    : '72px',
        }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.2 }}
      >

        {/* ── LEFT: Logo ── */}
        <div style={{ display: 'flex', alignItems: 'stretch', height: '100%', marginLeft: '20px' }}>
          <motion.div
            data-cursor-hover
            onClick={handleLogoClick}
            animate={{
              background: isProductPage ? '#0a0a0a' : '#F2EFEB',
              color     : isProductPage ? '#F2EFEB' : '#0a0a0a',
            }}
            transition={{ duration: 0.5, ease: EASE }}
            whileTap={{ scale: 0.96 }}
            style={{
              display        : 'inline-flex',
              flexDirection  : 'column',
              alignItems     : 'flex-start',
              justifyContent : 'flex-end',
              padding        : '6px 12px 10px 12px',
              cursor         : 'pointer',
              userSelect     : 'none',
              minWidth       : '72px',
              alignSelf      : 'stretch',
            }}
          >
            <span style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.2em', lineHeight: 1, opacity: 0.65, marginBottom: '9px', marginTop: 'auto' }}>
              WE+AR
            </span>
            <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.18em', lineHeight: 1, display: 'inline-block', transform: 'scaleY(1.55)', transformOrigin: 'bottom center', marginBottom: '6px' }}>
              KU
            </span>
            <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.18em', lineHeight: 1, display: 'inline-block', transform: 'scaleY(1.55)', transformOrigin: 'bottom center' }}>
              lT
            </span>
          </motion.div>
        </div>

        {/* ── CENTER: Hamburger / X ── */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/*
           * motion.div drives the colour.
           * .kult-hamburger-mobile-dark is only present when menu is closed
           * and not always-light page, so mobile CSS can force dark.
           * When menu opens: class removed → motion wins → X is always white.
           */}
          <motion.div
            className={`kult-hamburger ${hamMobileClass}`}
            animate={{ color: hamAnimColor }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <button
              data-cursor-hover
              className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 bg-transparent border-0 outline-none"
              style={{ cursor: 'pointer' }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={menuOpen ? closeMenu : openMenu}
            >
              <motion.span className="block h-px bg-current" style={{ width: '28px' }}
                animate={menuOpen ? { rotate: 45,  y: 6  } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }} />
              <motion.span className="block h-px bg-current" style={{ width: '18px' }}
                animate={menuOpen ? { opacity: 0, x: 8  } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }} />
              <motion.span className="block h-px bg-current" style={{ width: '28px' }}
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }} />
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

          <AnimatePresence mode="wait">
            {onBack ? (

              /* Cart page — ← BACK only */
              <motion.div
                key="back"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit   ={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <SlideButton
                  label="← BACK"
                  bg="var(--text)"
                  color="var(--bg)"
                  padding="8px 18px"
                  letterSpacing="0.2em"
                  onClick={onBack}
                />
              </motion.div>

            ) : (

              /* Normal pages */
              <motion.div
                key="normal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit   ={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ display: 'flex', alignItems: 'center' }}
              >

                {/* Cart badge — hidden on hero/main page, shown everywhere else */}
                <AnimatePresence mode="wait">
                  {!hideCartBadge && totalCount > 0 && (
                    <motion.div
                      key="badge"
                      initial={{ opacity: 0, x: 28, scale: 0.82, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0,  scale: 1,    filter: 'blur(0px)' }}
                      exit   ={{ opacity: 0, x: 16, scale: 0.88, filter: 'blur(3px)' }}
                      transition={{ duration: 0.75, ease: EASE_OUT, delay: 0.35 }}
                    >
                      {/*
                        cartLabelDark=true  → off-white bg pages (detail) — dark BASKET text
                        cartLabelDark=false → dark bg pages (product list) — light BASKET text
                        Mobile always forces dark via CSS media query inside CartBadge
                      */}
                      <CartBadge
                        count={totalCount}
                        onClick={onOpenCart}
                        labelDark={cartLabelDark}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action button — exits before badge appears */}
                <AnimatePresence mode="wait">
                  {showActionButton && (
                    isProductPage ? (
                      <motion.div
                        key="buynow"
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0  }}
                        exit   ={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        <SlideButton
                          label="BUY NOW"
                          bg="var(--text)"
                          color="var(--bg)"
                          padding="8px 18px"
                          letterSpacing="0.2em"
                          onClick={onOpenCart}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="products"
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0  }}
                        exit   ={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        <SlideButton
                          label="PRODUCTS"
                          bg="var(--text)"
                          color="var(--bg)"
                          padding="8px 18px"
                          letterSpacing="0.2em"
                          onClick={() => scrollTo('category', 1.4)}
                        />
                      </motion.div>
                    )
                  )}
                </AnimatePresence>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.nav>
    </>
  )
}