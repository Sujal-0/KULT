import React, { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

/* ─── Detect touch-primary device ───────────────────────────────
   We check on mount — if the primary input is coarse (finger)
   we skip rendering entirely. This means:
   • No invisible DOM nodes on mobile
   • No event listeners on mobile
   • No interference with native touch scroll/tap behaviour
   • Smooth transitions on mobile are fully unaffected
─────────────────────────────────────────────────────────────────  */
function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  )
}

export default function Cursor() {
  /* Bail out on touch devices — return null before any hooks would
     cause issues. We use a ref so it's evaluated once on mount.   */
  const isTouch = useRef(isTouchDevice())
  if (isTouch.current) return null

  return <DesktopCursor />
}

/* ─── Desktop-only cursor implementation ────────────────────── */
function DesktopCursor() {
  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  /* Inner dot — snappy */
  const dotX = useSpring(mouseX, { stiffness: 1000, damping: 50,  mass: 0.1 })
  const dotY = useSpring(mouseY, { stiffness: 1000, damping: 50,  mass: 0.1 })

  /* Outer ring — lags with inertia */
  const ringX = useSpring(mouseX, { stiffness: 200, damping: 28, mass: 0.5 })
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 28, mass: 0.5 })

  const [hovered,  setHovered]  = useState(false)
  const [clicking, setClicking] = useState(false)
  const [visible,  setVisible]  = useState(false)

  useEffect(() => {
    /* ── Mouse tracking ── */
    const onMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    /* ── Hover detection — any interactive element ── */
    const SELECTOR = 'a, button, [data-cursor-hover], input, textarea, select, label, [role="button"]'

    const onOver = (e) => {
      if (e.target.closest(SELECTOR)) setHovered(true)
    }
    const onOut  = (e) => {
      if (e.target.closest(SELECTOR)) setHovered(false)
    }

    /* ── Click press/release ── */
    const onDown = () => setClicking(true)
    const onUp   = () => setClicking(false)

    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseover',  onOver)
    document.addEventListener('mouseout',   onOut)

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseout',   onOut)
    }
  }, [mouseX, mouseY]) // eslint-disable-line react-hooks/exhaustive-deps

  const ringSize = clicking ? 22 : hovered ? 52 : 36
  const dotSize  = clicking ? 10 : hovered ? 6  : 4

  return (
    <>
      {/* ── Outer ring ── */}
      <motion.div
        style={{
          position     : 'fixed',
          top          : 0,
          left         : 0,
          x            : ringX,
          y            : ringY,
          translateX   : '-50%',
          translateY   : '-50%',
          width        : ringSize,
          height       : ringSize,
          border       : '1px solid rgba(242,239,235,0.7)',
          borderRadius : '50%',
          pointerEvents: 'none',
          zIndex       : 99999,
          opacity      : visible ? (hovered ? 0.65 : 0.4) : 0,
          mixBlendMode : 'difference',
          transition   : 'width 0.22s ease, height 0.22s ease, opacity 0.3s ease',
        }}
      />

      {/* ── Inner dot ── */}
      <motion.div
        style={{
          position     : 'fixed',
          top          : 0,
          left         : 0,
          x            : dotX,
          y            : dotY,
          translateX   : '-50%',
          translateY   : '-50%',
          width        : dotSize,
          height       : dotSize,
          background   : 'rgba(242,239,235,1)',
          borderRadius : '50%',
          pointerEvents: 'none',
          zIndex       : 100000,
          opacity      : visible ? 1 : 0,
          mixBlendMode : 'difference',
          transition   : 'width 0.18s ease, height 0.18s ease, opacity 0.3s ease',
        }}
      />
    </>
  )
}