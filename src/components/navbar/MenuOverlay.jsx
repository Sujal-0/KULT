import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Eases ── */
const EASE_IN  = [0.76, 0, 0.24, 1]
const EASE_OUT = [0.16, 1, 0.3, 1]

/* ── Nav items ── */
const NAV_ITEMS = [
  { label: 'HOME',     index: '01', targetId: 'hero'     },
  { label: 'PRODUCTS', index: '02', targetId: 'category' },
]

/* ── Dense grain (same as category section) ── */
const GRAIN = {
  position       : 'fixed',
  inset          : 0,
  opacity        : 0.14,
  pointerEvents  : 'none',
  zIndex         : 0,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundSize : '150px 150px',
  animation      : 'grain-shift 0.55s steps(1) infinite',
}

/* ── Single nav item ─────────────────────────────────────────── */
function NavItem({ label, index, delay, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      {/* Thin rule above each item */}
      <motion.div
        style={{
          height    : '1px',
          background: 'rgba(242,239,235,0.1)',
          transformOrigin: 'left center',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT, delay: delay + 0.1 }}
      />

      <button
        data-cursor-hover
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        style={{
          position       : 'relative',
          display        : 'flex',
          alignItems     : 'center',
          gap            : '1.6rem',
          width          : '100%',
          background     : 'transparent',
          border         : 'none',
          outline        : 'none',
          cursor         : 'none',
          padding        : '1.4rem 0',
          color          : 'var(--text)',
          fontFamily     : 'var(--font)',
          overflow       : 'hidden',
        }}
      >
        {/* Hover fill rect — slides in from left */}
        <motion.div
          style={{
            position  : 'absolute',
            inset     : 0,
            background: 'rgba(242,239,235,0.05)',
            zIndex    : 0,
          }}
          animate={{ x: hovered ? '0%' : '-101%' }}
          transition={{ duration: 0.45, ease: EASE_IN }}
        />

        {/* Index number */}
        <motion.span
          style={{
            position    : 'relative',
            zIndex      : 1,
            fontSize    : '11px',
            fontWeight  : 400,
            letterSpacing: '0.3em',
            opacity     : hovered ? 0.5 : 0.2,
            minWidth    : '2.4rem',
            textAlign   : 'right',
            transition  : 'opacity 0.3s ease',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 0.5 : 0.2 }}
          transition={{ duration: 0.3 }}
        >
          {index}
        </motion.span>

        {/* Label — revealed from bottom via clipPath on entry */}
        <div style={{ overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <motion.span
            style={{
              display      : 'block',
              fontSize     : 'clamp(28px, 10vw, 86px)',
              fontWeight   : 900,
              letterSpacing: '0.04em',
              lineHeight   : 1,
              whiteSpace   : 'nowrap',
            }}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%',   opacity: 1 }}
            transition={{ duration: 0.85, ease: EASE_OUT, delay }}
          >
            {label}
          </motion.span>
        </div>

      </button>
    </div>
  )
}

/* ── OVERLAY ─────────────────────────────────────────────────── */
export default function MenuOverlay({ isOpen, onClose, onNavigateTo }) {
  const navigate = (targetId) => {
    onClose()
    /*
      Delegate to the parent-provided callback after the close animation.
      This works whether we're on the main page OR the product page,
      because Home.jsx decides whether to setActivePage(null) first.
    */
    setTimeout(() => onNavigateTo?.(targetId), 650)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="menu-overlay"
          style={{
            position     : 'fixed',
            inset        : 0,
            background   : '#030303',
            zIndex       : 90,
            display      : 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop   : '96px',   /* clears the 72px navbar + breathing room */
            overflow     : 'hidden',
          }}
          /* Curtain wipes DOWN on open, UP on exit */
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)'   }}
          exit   ={{ clipPath: 'inset(0 0 100% 0)'  }}
          transition={{ duration: 0.7, ease: EASE_IN }}
        >
          {/* Grain */}
          <div style={GRAIN} />

          {/* Nav content — positioned in lower 2/3 of screen for editorial feel */}
          <div
            style={{
              position   : 'relative',
              zIndex     : 1,
              padding    : '0 6vw 0 calc(6vw + 2.4rem + 1.6rem)',
              /* the left offset aligns labels past the index column */
              overflow   : 'hidden',
            }}
          >
            {NAV_ITEMS.map((item, i) => (
              <NavItem
                key={item.label}
                label={item.label}
                index={item.index}
                delay={0.2 + i * 0.1}
                onClick={() => navigate(item.targetId)}
              />
            ))}

            {/* Bottom rule */}
            <motion.div
              style={{
                height    : '1px',
                background: 'rgba(242,239,235,0.1)',
                transformOrigin: 'left center',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.45 }}
            />
          </div>

          {/* Bottom metadata */}
          <motion.div
            style={{
              position   : 'absolute',
              bottom     : '2.5rem',
              left       : '8vw',
              right      : '8vw',
              display    : 'flex',
              justifyContent: 'space-between',
              zIndex     : 1,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span style={{ fontFamily: 'var(--font)', fontSize: '9px', letterSpacing: '0.45em', opacity: 0.2 }}>
              KULT
            </span>
            <span style={{ fontFamily: 'var(--font)', fontSize: '9px', letterSpacing: '0.45em', opacity: 0.2 }}>
              SS 26 COLLECTION
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
