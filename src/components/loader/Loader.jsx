import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FlipCard from './FlipCard'

/* ── Sequence & timing ─────────────────────────────────────── */
const SEQUENCE    = [0, 11, 23, 40, 52, 67, 81, 93, 100]
const HOLD_MS     = 180   // show each number before triggering flip
const FLIP_MS     = 500   // wait this long after flip starts → advance state
                          // (slightly longer than the 0.44s animation to let it settle)
const EXIT_HOLD   = 600   // pause at 100 before exit animation

/* ── Progress helper ───────────────────────────────────────── */
function stepToProgress(index) {
  return Math.round((index / (SEQUENCE.length - 1)) * 100)
}

export default function Loader({ onComplete }) {
  const [stepIndex,  setStepIndex]  = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [exiting,    setExiting]    = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    const isLast = stepIndex >= SEQUENCE.length - 1

    if (isLast) {
      /* Reached 100 — hold briefly then exit */
      timer.current = setTimeout(() => {
        setExiting(true)
        setTimeout(onComplete, 850)
      }, EXIT_HOLD)
      return
    }

    /* Hold → start flip → advance to next step */
    timer.current = setTimeout(() => {
      setIsFlipping(true)

      timer.current = setTimeout(() => {
        setIsFlipping(false)
        setStepIndex(i => i + 1)
      }, FLIP_MS)
    }, HOLD_MS)

    return () => clearTimeout(timer.current)
  }, [stepIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const current  = String(SEQUENCE[stepIndex])
  const nextIdx  = Math.min(stepIndex + 1, SEQUENCE.length - 1)
  const next     = String(SEQUENCE[nextIdx])
  const progress = stepToProgress(stepIndex)

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          className="loader-root"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-5%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >

          {/* ── Brand stamp — top left ── */}
          <motion.span
            style={{
              position     : 'absolute',
              top          : '2.5rem',
              left         : '2.5rem',
              fontFamily   : 'var(--font)',
              color        : 'var(--text)',
              fontSize     : '11px',
              letterSpacing: '0.35em',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            KULT
          </motion.span>

          {/* ── Central flip display ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
            <FlipCard
              current={current}
              next={next}
              isFlipping={isFlipping}
            />

            {/* Percent row: current value + % glyph */}
            <motion.div
              style={{
                display      : 'flex',
                alignItems   : 'baseline',
                gap          : '6px',
                fontFamily   : 'var(--font)',
                color        : 'var(--text)',
                fontSize     : '10px',
                letterSpacing: '0.45em',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              <span>%</span>
              <span style={{ opacity: 0.5 }}>SS26</span>
            </motion.div>
          </div>

          {/* ── Step dots — bottom center ── */}
          <motion.div
            style={{
              position      : 'absolute',
              bottom        : '4rem',
              display       : 'flex',
              gap           : '6px',
              alignItems    : 'center',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {SEQUENCE.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width      : i === stepIndex ? 20 : 4,
                  opacity    : i <= stepIndex ? 1 : 0.2,
                  background : i === stepIndex ? '#F2EFEB' : 'rgba(242,239,235,0.5)',
                }}
                transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                style={{
                  height      : '2px',
                  borderRadius: '1px',
                }}
              />
            ))}
          </motion.div>

          {/* ── LOADING label — bottom ── */}
          <motion.span
            style={{
              position     : 'absolute',
              bottom       : '2.2rem',
              fontFamily   : 'var(--font)',
              color        : 'var(--text)',
              fontSize     : '9px',
              letterSpacing: '0.55em',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.28 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            LOADING
          </motion.span>

          {/* ── Thin progress line — very bottom edge ── */}
          <motion.div
            style={{
              position  : 'absolute',
              bottom    : 0,
              left      : 0,
              height    : '1px',
              background: 'var(--text)',
              opacity   : 0.18,
              width     : `${progress}%`,
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: HOLD_MS / 1000, ease: 'linear' }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  )
}
