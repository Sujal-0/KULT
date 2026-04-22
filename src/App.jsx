import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

import Loader  from './components/loader/Loader'
import Cursor  from './components/cursor/Cursor'
import Home    from './pages/Home'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const lenisRef = useRef(null)

  /* ── Init Lenis smooth scroll after loader exits ── */
  useEffect(() => {
    if (!loaded) return

    const lenis = new Lenis({
      duration:    1.35,
      easing:      t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current  = lenis
    window.__lenis    = lenis   // expose globally for scrollTo calls

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.__lenis = null
    }
  }, [loaded])

  return (
    <>
      {/* Global custom cursor */}
      <Cursor />

      {/* Loader — unmounts when done */}
      <AnimatePresence mode="wait">
        {!loaded && (
          <Loader key="loader" onComplete={() => setLoaded(true)} />
        )}
      </AnimatePresence>

      {/* Main content — only mounted AFTER loader exits so animations run fresh */}
      <AnimatePresence>
        {loaded && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <Home />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
