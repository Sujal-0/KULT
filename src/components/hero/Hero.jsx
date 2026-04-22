import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Text reveal timings ──────────────────────────────────── */
// KULT comes up first, FOR THE FEW. follows 400ms later.
// clipPath: inset(100% → 0%) reveals bottom-to-top from behind a clip.
// Combined with a slight y drift for physical feel.

const KULT_REVEAL = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', y: 18, opacity: 0 },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    y: 0,
    opacity: 1,
    transition: {
      clipPath: { duration: 1.05, ease: [0.76, 0, 0.24, 1], delay: 0.15 },
      y: { duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
      opacity: { duration: 0.5, ease: 'easeOut', delay: 0.15 },
    },
  },
}

const FEW_REVEAL = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', y: 12, opacity: 0 },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    y: 0,
    opacity: 1,
    transition: {
      clipPath: { duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.55 },
      y: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.55 },
      opacity: { duration: 0.4, ease: 'easeOut', delay: 0.55 },
    },
  },
}

const TAGLINE = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 0.4,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 },
  },
}

const SCROLL_HINT = {
  hidden: { opacity: 0 },
  show: {
    opacity: 0.3,
    transition: { duration: 1, delay: 1.2 },
  },
}

/* ─── Panel configs ─────────────────────────────────────────── */
const PANELS = [
  { opacity: 0.20, delay: 0 },
  { opacity: 0.40, delay: 0.07 },
  { opacity: 0.60, delay: 0.14 },
]

const panelVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  show: (delay) => ({
    scaleY: 1,
    opacity: 1,
    transition: {
      delay,
      duration: 0.55,
      ease: [0.76, 0, 0.24, 1],
    },
  }),
  exit: (delay) => ({
    scaleY: 0,
    opacity: 0,
    transition: {
      delay,
      duration: 0.4,
      ease: [0.76, 0, 0.24, 1],
    },
  }),
}

/* ─── COMPONENT ────────────────────────────────────────────── */
export default function Hero() {
  const videoRef = useRef(null)
  const scrolling = useRef(false)        // cooldown flag
  const [hovering, setHovering] = useState(false)

  /* Super slow playback — cinematic crawl */
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const setRate = () => { vid.playbackRate = 0.25 }
    setRate()
    vid.addEventListener('ratechange', setRate)
    return () => vid.removeEventListener('ratechange', setRate)
  }, [])

  /* One-scroll snap: while hero is the active section, any downward
     wheel/touch moves instantly to the category section via Lenis    */
  useEffect(() => {
    const COOLDOWN_MS = 1800  // prevent double-fire during long scroll

    const onWheel = (e) => {
      /* Only hijack when user is near the top (hero still dominant) */
      if (window.scrollY > window.innerHeight * 0.4) return
      if (e.deltaY <= 0) return      // ignore upward scroll
      if (scrolling.current) return  // already animating

      const target = document.getElementById('category')
      if (!target) return

      scrolling.current = true
      setTimeout(() => { scrolling.current = false }, COOLDOWN_MS)

      if (window.__lenis) {
        window.__lenis.scrollTo(target, {
          duration: 1.6,
          easing: t => t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2,  // easeInOutCubic
        })
      } else {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        height: '100svh',
        minHeight: '520px',
        fontFamily: 'var(--font)',
        color: 'var(--text)',
        cursor: 'none',
        paddingTop: 'clamp(56px, 11vw, 92px)',
        paddingInline: 'clamp(14px, 4vw, 36px)',
        overflowX: 'hidden',
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* ── LAYER 0 — Background video ── */}
      <video
        ref={videoRef}
        src="/BackgroundKULT.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.28,
          filter: 'blur(1.5px) saturate(0.6)',
        }}
      />

      {/* ── LAYER 1 — Dark gradient overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* ── LAYER 2 — Grain / Noise overlay ── */}
      <div className="hero-grain" style={{ position: 'absolute', inset: 0, zIndex: 2 }} />

      {/* ── LAYER 3 — Subtle glitch flicker ── */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          background: 'rgba(255,255,255,0.015)',
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0, 0.06, 0, 0.03, 0] }}
        transition={{
          duration: 0.18,
          repeat: Infinity,
          repeatDelay: 4.7,
          ease: 'linear',
        }}
      />

      {/* ── LAYER 4 — Hover vertical panels ── */}
      <AnimatePresence>
        {hovering && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 4,
              display: 'flex',
              pointerEvents: 'none',
            }}
          >
            {PANELS.map((p, i) => (
              <motion.div
                key={i}
                custom={p.delay}
                variants={panelVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{
                  flex: '0 0 33.333%',
                  background: `rgba(0,0,0,${p.opacity})`,
                  originY: 0,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ── LAYER 5 — Main content ── */}
      <div
        className="flex flex-col items-center text-center"
        style={{ position: 'relative', zIndex: 5 }}
      >
        {/* KULT — reveals first */}
        <motion.h1
          variants={KULT_REVEAL}
          initial="hidden"
          animate="show"
          className="font-black leading-none"
          style={{
            fontSize: 'clamp(54px, 15vw, 220px)',
            letterSpacing: 'clamp(0.16em, 1.8vw, 0.3em)',
            display: 'inline-block',
            transform: 'scaleY(2.2)',
            transformOrigin: 'center center',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
          }}
        >
          KUlT
        </motion.h1>

        {/* FOR THE FEW. — reveals second, 400ms later */}
        <motion.p
          variants={FEW_REVEAL}
          initial="hidden"
          animate="show"
          className="font-extralight"
          style={{
            fontSize: 'clamp(11px, 2.8vw, 22px)',
            letterSpacing: 'clamp(0.18em, 1.8vw, 0.45em)',
            marginTop: 'clamp(0.35rem, 1.8vw, 0.6rem)',
            paddingInline: 'clamp(10px, 4vw, 18px)',
          }}
        >
          FOR THE FEW.
        </motion.p>
      </div>


      {/* ── Tagline sub-copy ── */}
      <motion.p
        variants={TAGLINE}
        initial="hidden"
        animate="show"
        style={{
          position: 'absolute',
          bottom: 'clamp(3.3rem, 10vw, 5rem)',
          fontSize: 'clamp(9px, 2.2vw, 10px)',
          letterSpacing: 'clamp(0.24em, 1.2vw, 0.5em)',
          opacity: 0,
          zIndex: 5,
          textAlign: 'center',
          maxWidth: '100%',
          paddingInline: 'clamp(12px, 4vw, 24px)',
        }}
      >
        SS / 26 COLLECTION
      </motion.p>

      {/* ── Year stamp ── */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 'clamp(1.35rem, 4.2vw, 2.2rem)',
          right: 'clamp(1rem, 3.4vw, 2rem)',
          fontSize: 'clamp(9px, 2vw, 11px)',
          letterSpacing: 'clamp(0.16em, 1vw, 0.35em)',
          zIndex: 5,
        }}
      >
        ©2026
      </motion.span>
    </section>
  )
}