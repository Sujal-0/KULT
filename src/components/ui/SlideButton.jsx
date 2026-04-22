import React, { useState } from 'react'
import { motion } from 'framer-motion'

const EASE     = [0.76, 0, 0.24, 1]
const DURATION = 0.42

/**
 * SlideButton — reusable text-reveal-on-hover button
 *
 * Props
 * ─────
 * label        string    Button text (required)
 * bg           string    Background color          default: 'transparent'
 * color        string    Text color                default: 'var(--text)'
 * hoverColor   string    Text color on hover       default: same as color
 * border       string    CSS border shorthand      default: none
 * padding      string    CSS padding               default: '0'
 * fontSize     string    CSS font-size             default: '11px'
 * letterSpacing string   CSS letter-spacing        default: '0.22em'
 * fontWeight   string    CSS font-weight           default: '700'
 * onClick      fn        Click handler
 * style        object    Extra inline styles merged onto the button
 */
export default function SlideButton({
  label,
  bg           = 'transparent',
  color        = 'var(--text)',
  hoverColor,
  border       = 'none',
  padding      = '0',
  fontSize     = '11px',
  letterSpacing = '0.22em',
  fontWeight   = '700',
  onClick,
  style        = {},
  ...rest
}) {
  const [hovered, setHovered] = useState(false)
  const textColor = (hovered && hoverColor) ? hoverColor : color

  return (
    <button
      data-cursor-hover
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      {...rest}
      style={{
        /* Layout */
        position    : 'relative',
        overflow    : 'hidden',
        display     : 'inline-flex',
        alignItems  : 'center',
        /* Reset */
        background  : bg,
        border,
        outline     : 'none',
        cursor      : 'none',
        borderRadius: '3px',
        /* Typography */
        fontFamily  : 'var(--font)',
        color       : textColor,
        fontSize,
        letterSpacing,
        fontWeight,
        lineHeight  : 1,
        /* User supplied overrides */
        padding,
        transition  : 'color 0.25s ease',
        ...style,
      }}
    >
      {/*
        Two copies of the label, both in a flex column.
        At rest:   top=0%, bottom=100% (bottom hidden below)
        On hover:  top=-100% (exits up), bottom=0% (enters from below)
      */}
      <span
        style={{
          display       : 'flex',
          flexDirection : 'column',
          pointerEvents : 'none',
          userSelect    : 'none',
        }}
      >
        {/* Visible label — slides UP and out on hover */}
        <motion.span
          animate={{ y: hovered ? '-100%' : '0%' }}
          transition={{ duration: DURATION, ease: EASE }}
          style={{ display: 'block' }}
        >
          {label}
        </motion.span>

        {/* Duplicate — starts below, slides UP into view on hover */}
        <motion.span
          aria-hidden
          animate={{ y: hovered ? '-100%' : '0%' }}
          transition={{ duration: DURATION, ease: EASE }}
          style={{
            display  : 'block',
            position : 'absolute',
            top      : '100%',  /* sits directly below the button's text area */
            left     : 0,
            right    : 0,
            textAlign: 'center',
          }}
        >
          {label}
        </motion.span>
      </span>
    </button>
  )
}
