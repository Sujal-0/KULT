import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const EASE_OUT = [0.16, 1, 0.3, 1]
const EASE_IN  = [0.76, 0, 0.24, 1]

/* ── Dense grain (matches the rest of the site) ── */
const GRAIN_STYLE = {
  position      : 'absolute',
  inset         : '-10%',
  width         : '120%',
  height        : '120%',
  opacity       : 0.12,
  pointerEvents : 'none',
  zIndex        : 0,
  willChange    : 'transform',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundSize: '150px 150px',
  animation     : 'grain-shift 0.55s steps(1) infinite',
}

export default function ComingSoon() {
  const [tick, setTick] = useState(true)

  /* Blinking cursor */
  useEffect(() => {
    const id = setInterval(() => setTick(t => !t), 530)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      style={{
        position  : 'relative',
        background: '#030303',
        height    : '100svh',
        display   : 'flex',
        flexDirection: 'column',
        overflow  : 'hidden',
        fontFamily: 'var(--font)',
        willChange: 'transform',
      }}
    >
      {/* Grain */}
      <div style={GRAIN_STYLE} />

      {/* Thin horizontal rule — top accent */}
      <motion.div
        style={{
          position  : 'absolute',
          top       : '72px',
          left      : '8vw',
          right     : '8vw',
          height    : '1px',
          background: 'rgba(242,239,235,0.08)',
          zIndex    : 1,
        }}
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.3 }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position      : 'relative',
          zIndex        : 1,
          flex          : 1,
          display       : 'flex',
          flexDirection : 'column',
          justifyContent: 'center',
          padding       : '0 8vw',
        }}
      >
        {/* Eyebrow */}
        <motion.p
          style={{
            fontSize     : '9px',
            fontWeight   : 700,
            letterSpacing: '0.55em',
            color        : 'rgba(242,239,235,0.3)',
            marginBottom : '2.8rem',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.4 }}
        >
          KULT — SS 26 COLLECTION
        </motion.p>

        {/* Giant heading */}
        <div style={{ overflow: 'hidden', marginBottom: '1.2rem' }}>
          <motion.h1
            style={{
              fontSize     : 'clamp(52px, 12vw, 148px)',
              fontWeight   : 900,
              letterSpacing: '0.02em',
              lineHeight   : 0.92,
              color        : '#F2EFEB',
              margin       : 0,
            }}
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.5 }}
          >
            COMING
          </motion.h1>
        </div>

        <div style={{ overflow: 'hidden', marginBottom: '3.5rem' }}>
          <motion.h1
            style={{
              fontSize     : 'clamp(52px, 12vw, 148px)',
              fontWeight   : 900,
              letterSpacing: '0.02em',
              lineHeight   : 0.92,
              color        : '#F2EFEB',
              margin       : 0,
              display      : 'flex',
              alignItems   : 'baseline',
              gap          : '0.18em',
            }}
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.62 }}
          >
            SOON
            {/* Blinking cursor */}
            <motion.span
              animate={{ opacity: tick ? 1 : 0 }}
              transition={{ duration: 0.05 }}
              style={{
                display     : 'inline-block',
                width       : 'clamp(4px, 0.7vw, 10px)',
                height      : 'clamp(38px, 8vw, 104px)',
                background  : '#F2EFEB',
                marginBottom: '4px',
                flexShrink  : 0,
              }}
            />
          </motion.h1>
        </div>

        {/* Sub-copy */}
        <motion.p
          style={{
            fontSize     : '11px',
            letterSpacing: '0.18em',
            color        : 'rgba(242,239,235,0.35)',
            maxWidth     : '360px',
            lineHeight   : 1.7,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.9 }}
        >
          We're finalising the checkout experience.
          <br />
          Orders will open soon — stay close.
        </motion.p>
      </div>

      {/* ── Bottom metadata bar ── */}
      <motion.div
        style={{
          position      : 'relative',
          zIndex        : 1,
          padding       : '2rem 8vw',
          display       : 'flex',
          justifyContent: 'space-between',
          alignItems    : 'center',
          borderTop     : '1px solid rgba(242,239,235,0.06)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 1.1 }}
      >
        <span style={{ fontSize: '9px', letterSpacing: '0.45em', color: 'rgba(242,239,235,0.18)' }}>
          WE+AR KULT
        </span>
        <span style={{ fontSize: '9px', letterSpacing: '0.45em', color: 'rgba(242,239,235,0.18)' }}>
          © 2026
        </span>
      </motion.div>
    </div>
  )
}
