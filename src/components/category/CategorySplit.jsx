import React, { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

/* ── Shared ease ── */
const EASE = [0.76, 0, 0.24, 1]

/* ── Dense grain for category section ── */
const GRAIN_STYLE = {
  position       : 'absolute',
  inset          : '-50%',
  width          : '200%',
  height         : '200%',
  opacity        : 0.18,
  pointerEvents  : 'none',
  zIndex         : 1,
  animation      : 'grain-shift 0.55s steps(1) infinite',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  backgroundSize : '140px 140px',
  backgroundRepeat: 'repeat',
}

/* ── Hover panel configs (same logic as Hero, confined per panel) ── */
const H_PANELS = [
  { opacity: 0.20, delay: 0 },
  { opacity: 0.40, delay: 0.07 },
  { opacity: 0.60, delay: 0.14 },
]
const hPanelVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  show: (d) => ({ scaleY: 1, opacity: 1, transition: { delay: d, duration: 0.5,  ease: EASE } }),
  exit: (d) => ({ scaleY: 0, opacity: 0, transition: { delay: d, duration: 0.35, ease: EASE } }),
}

/* ─── Single panel ─────────────────────────────────────────── */
function Panel({ label, side, inView, textDelay = 0, onNavigate }) {
  const [hovering, setHovering] = useState(false)
  const target = side === 'left' ? 'mens' : 'womens'

  return (
    <div
      className="category-panel relative flex-1 flex items-center justify-center"
      style={{ minHeight: '50svh', cursor: 'none', overflow: 'hidden', width: '100%' }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => onNavigate && onNavigate(target)}
      data-cursor-hover
    >
      {/* ── Per-panel hover vertical strips ── */}
      <AnimatePresence>
        {hovering && (
          <div
            style={{
              position     : 'absolute',
              inset        : 0,
              display      : 'flex',
              zIndex       : 3,
              pointerEvents: 'none',
            }}
          >
            {H_PANELS.map((p, i) => (
              <motion.div
                key={i}
                custom={p.delay}
                variants={hPanelVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{
                  flex      : '0 0 33.333%',
                  background: `rgba(0,0,0,${p.opacity})`,
                  originY   : 0,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ── Label — KULT_REVEAL style (inset from top, wipes up)
            Negative left/right inset gives font glyphs breathing room
            so the S (and any optical overflow) is never clipped       ── */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.span
          className="font-black leading-none"
          style={{
            fontFamily   : 'var(--font)',
            color        : 'var(--text)',
          fontSize     : 'clamp(44px, 14vw, 130px)',
            letterSpacing: '-0.02em',
            display      : 'block',
            /*
              paddingInlineEnd balances the negative letter-spacing so the
              last glyph's right edge has equal visual space and won't touch
              the panel's overflow:hidden boundary
            */
            paddingInlineEnd: '0.06em',
          }}
          initial={{ clipPath: 'inset(105% -24px 0% -24px)' }}
          animate={inView
            ? { clipPath: 'inset(0%   -24px 0% -24px)' }
            : { clipPath: 'inset(105% -24px 0% -24px)' }
          }
          transition={{
            duration: 1.05,
            ease    : EASE,
            delay   : textDelay,
          }}
        >
          {label}
        </motion.span>
      </div>

      {/* ── Corner tag ── */}
      <motion.span
        style={{
          position     : 'absolute',
          fontFamily   : 'var(--font)',
          color        : 'var(--text)',
          fontSize     : 'clamp(8px, 2vw, 9px)',
          letterSpacing: 'clamp(0.2em, 1vw, 0.45em)',
          opacity      : 0,
          bottom       : 'clamp(1rem, 3.5vw, 2rem)',
          [side === 'left' ? 'left' : 'right']: 'clamp(1rem, 3.5vw, 2rem)',
          zIndex       : 2,
        }}
        animate={inView ? { opacity: 0.18 } : { opacity: 0 }}
        transition={{ duration: 0.7, delay: textDelay + 0.55 }}
      >
        {side === 'left' ? 'MNS' : 'WMNS'}
      </motion.span>
    </div>
  )
}

/* ─── MAIN SECTION ─────────────────────────────────────────── */
export default function CategorySplit({ onNavigate }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <section
      id="category"
      ref={ref}
      className="category-root"
      style={{
        position  : 'relative',
        minHeight : '100svh',
        background: '#000',
        overflow  : 'hidden',
      }}
    >
      {/* ── Dense grain ── */}
      <div style={GRAIN_STYLE} />

      {/* ── Page-flip curtain slides upward to reveal section ── */}
      <motion.div
        style={{
          position       : 'absolute',
          inset          : 0,
          background     : '#000',
          zIndex         : 30,
          transformOrigin: 'top center',
          pointerEvents  : 'none',
        }}
        initial={{ scaleY: 1 }}
        animate={inView ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 1.15, ease: EASE }}
      />

      {/* ── Leading sweep line ── */}
      <motion.div
        style={{
          position       : 'absolute',
          top            : 0,
          left           : 0,
          right          : 0,
          height         : '1px',
          background     : 'rgba(242,239,235,0.3)',
          zIndex         : 31,
          transformOrigin: 'left center',
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── Panels ── */}
      <div className="category-panels flex" style={{ minHeight: '100svh' }}>
        <Panel label="MNS"  side="left"  inView={inView} textDelay={0.5}  onNavigate={onNavigate} />

        {/* ── Horizontal divider (mobile only) ── */}
        <motion.div
          className="category-divider-h"
          style={{
            height         : '1px',
            background     : 'rgba(242,239,235,0.28)',
            zIndex         : 5,
            originX        : 0,
            flexShrink     : 0,
            width          : 'calc(100% - 4rem)',
            alignSelf      : 'center',
            margin         : '0 2rem',
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        />

        <Panel label="WMNS" side="right" inView={inView} textDelay={0.65} onNavigate={onNavigate} />
      </div>

      {/*
        ── Center divider ──
        Positioned at exact mid-point of the section.
        Uses calc to avoid transform conflicts with Framer Motion scaleY.
        300px height looks genuinely centred on 100vh.
      */}
      <motion.div
        className="category-divider"
        style={{
          position       : 'absolute',
          left           : 'calc(50% - 1px)',   /* 1px = half of 2px width → true centre */
          top            : 'calc(50% - 150px)', /* 150px = half of 300px height */
          width          : '2px',
          height         : '300px',
          background     : 'rgba(242,239,235,0.28)',
          zIndex         : 5,
          originY        : 0,
        }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      />

      <style>{`
        .category-panels {
          flex-direction: column;
        }

        .category-divider {
          display: none;
        }

        .category-divider-h {
          display: block;
        }

        @media (min-width: 900px) {
          .category-panels {
            flex-direction: row;
          }

          .category-panel {
            min-height: 100svh !important;
            width: auto !important;
          }

          .category-divider {
            display: block;
          }

          .category-divider-h {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
