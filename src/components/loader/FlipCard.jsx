import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Card geometry (all values in px) ─────────────────────── */
const CARD_H = 260       // total card height  (matches existing flip-card CSS)
const HALF   = CARD_H / 2  // 130 — each panel height
const OFFSET = HALF / 2    // 65  — translateY to align text at centre-line

/* ── Shared ease ───────────────────────────────────────────── */
const EASE = [0.76, 0, 0.24, 1]

/* ── Text label — visually centred at the card mid-line ────── */
function Label({ value, yOffset }) {
  return (
    <span
      style={{
        display      : 'block',
        width        : '100%',
        textAlign    : 'center',
        fontFamily   : 'var(--font)',
        fontSize     : 'clamp(120px, 18vw, 220px)',
        fontWeight   : 900,
        color        : '#F2EFEB',
        lineHeight   : 1,
        letterSpacing: '-0.02em',
        userSelect   : 'none',
        pointerEvents: 'none',
        transform    : `translateY(${yOffset}px)`,
        willChange   : 'transform',
      }}
    >
      {value}
    </span>
  )
}

/* ── Half-panel shell — clips to its 50 % of the card ──────── */
function Half({ pin, children, extraStyle }) {
  const isTop = pin === 'top'
  return (
    <div
      style={{
        position  : 'absolute',
        ...(isTop ? { top: 0 } : { bottom: 0 }),
        left      : 0,
        right     : 0,
        height    : HALF,
        overflow  : 'hidden',
        display   : 'flex',
        alignItems: 'center',
        background: '#000',
        ...extraStyle,
      }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FlipCard
   Props
   ─────
   current    string   number currently displayed  (e.g. "23")
   next       string   number about to appear      (e.g. "40")
   isFlipping boolean  parent triggers the flip
   ════════════════════════════════════════════════════════════ */
export default function FlipCard({ current, next, isFlipping }) {
  return (
    <div
      style={{
        position : 'relative',
        /* Wide enough for 3-digit "100"; height = card spec */
        width    : 'clamp(260px, 38vw, 480px)',
        height   : CARD_H,
        perspective: '900px',
      }}
    >
      {/* ── STATIC LAYER: bottom half always shows CURRENT ── */}
      <Half pin="bottom">
        <Label value={current} yOffset={-OFFSET} />
      </Half>

      {/* ── STATIC LAYER: top half shows NEXT (when flipping) else CURRENT ── */}
      <Half pin="top">
        <Label value={isFlipping ? next : current} yOffset={OFFSET} />
      </Half>

      {/* ── ANIMATED TOP FLAP: current's top half rotates 0 → -90 ── */}
      <AnimatePresence>
        {isFlipping && (
          <motion.div
            key={`tf-${current}-${next}`}
            style={{
              position          : 'absolute',
              top               : 0, left: 0, right: 0,
              height            : HALF,
              overflow          : 'hidden',
              transformOrigin   : 'bottom center',
              zIndex            : 5,
              display           : 'flex',
              alignItems        : 'center',
              background        : '#000',
              backfaceVisibility: 'hidden',
            }}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -90 }}
            exit={{}}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <Label value={current} yOffset={OFFSET} />

            {/* Shadow deepens as flap folds away */}
            <motion.div
              style={{
                position    : 'absolute',
                inset       : 0,
                background  : 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))',
                pointerEvents: 'none',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.42, ease: EASE }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ANIMATED BOTTOM FLAP: next's bottom half unfolds 90 → 0 ── */}
      <AnimatePresence>
        {isFlipping && (
          <motion.div
            key={`bf-${current}-${next}`}
            style={{
              position          : 'absolute',
              bottom            : 0, left: 0, right: 0,
              height            : HALF,
              overflow          : 'hidden',
              transformOrigin   : 'top center',
              zIndex            : 4,
              display           : 'flex',
              alignItems        : 'center',
              background        : '#000',
              backfaceVisibility: 'hidden',
            }}
            initial={{ rotateX: 90 }}
            animate={{ rotateX: 0 }}
            exit={{}}
            transition={{ duration: 0.44, ease: EASE, delay: 0.06 }}
          >
            <Label value={next} yOffset={-OFFSET} />

            {/* Shadow lifts as flap reveals */}
            <motion.div
              style={{
                position    : 'absolute',
                inset       : 0,
                background  : 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
                pointerEvents: 'none',
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.44, ease: EASE, delay: 0.06 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Centre divider line ── */}
      <div
        style={{
          position  : 'absolute',
          top       : HALF,
          left      : 0,
          right     : 0,
          height    : '1px',
          background: 'rgba(0,0,0,0.85)',
          zIndex    : 10,
          transform : 'translateY(-50%)',
        }}
      />
    </div>
  )
}
