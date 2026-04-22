import React from 'react'
import { motion } from 'framer-motion'

const EASE_CLIP = [0.76, 0, 0.24, 1]
const EASE_MOVE = [0.16, 1, 0.3, 1]

const revealUp = (delay = 0, y = 20, duration = 0.9) => ({
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', y, opacity: 0 },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    y: 0,
    opacity: 1,
    transition: {
      clipPath: { duration, ease: EASE_CLIP, delay },
      y: { duration, ease: EASE_MOVE, delay },
      opacity: { duration: 0.45, ease: 'easeOut', delay },
    },
  },
})

const linkReveal = (delay = 0) => ({
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE_MOVE, delay },
  },
})

const CONTACT_LINKS = [
  { label: 'EMAIL', href: 'mailto:sujalsing2204@gmail.com', external: false },
  { label: 'GITHUB', href: 'https://github.com/Sujal-0', external: true },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/sujalsingh01', external: true },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/_sujal_singh01/', external: true },
]

// Alternative luxury lines:
// - BUILT FOR A RARE EYE.
// - QUIET LUXURY. SHARP INTENT.
// - FOR THOSE WHO NOTICE.
const TAGLINE = 'FOR THE FEW.'

function FooterLink({ href, label, delay, external }) {
  return (
    <motion.a
      data-cursor-hover
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      variants={linkReveal(delay)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        fontFamily: 'var(--font)',
        fontSize: 'clamp(10px, 0.85vw, 12px)',
        fontWeight: 500,
        letterSpacing: '0.2em',
        color: '#F2EFEB',
        textDecoration: 'none',
        opacity: 0.78,
        cursor: 'none',
        transition: 'opacity 0.28s ease, transform 0.28s ease',
        width: 'fit-content',
        minHeight: '44px',
        padding: '10px 0',
        borderBottom: '1px solid rgba(242,239,235,0.22)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.transform = 'translateX(4px)'
        e.currentTarget.style.borderBottomColor = 'rgba(242,239,235,0.65)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.opacity = '0.78'
        e.currentTarget.style.transform = 'translateX(0px)'
        e.currentTarget.style.borderBottomColor = 'rgba(242,239,235,0.22)'
      }}
    >
      {label}
    </motion.a>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <section
      id="footer"
      className="footer-root"
      style={{
        height: '100svh',
        minHeight: '680px',
        background: '#0A0A0A',
        color: '#F2EFEB',
        fontFamily: 'var(--font)',
        display: 'flex',
        cursor: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.13,
          zIndex: 0,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.9%27%3E%3Ccircle cx=%2711%27 cy=%279%27 r=%270.8%27/%3E%3Ccircle cx=%2732%27 cy=%2726%27 r=%270.7%27/%3E%3Ccircle cx=%2756%27 cy=%2718%27 r=%270.6%27/%3E%3Ccircle cx=%2790%27 cy=%2738%27 r=%270.9%27/%3E%3Ccircle cx=%27130%27 cy=%2716%27 r=%270.7%27/%3E%3Ccircle cx=%27148%27 cy=%2748%27 r=%270.8%27/%3E%3Ccircle cx=%2719%27 cy=%2760%27 r=%270.6%27/%3E%3Ccircle cx=%2745%27 cy=%2778%27 r=%270.8%27/%3E%3Ccircle cx=%2774%27 cy=%2768%27 r=%270.7%27/%3E%3Ccircle cx=%27108%27 cy=%2784%27 r=%270.9%27/%3E%3Ccircle cx=%27136%27 cy=%2768%27 r=%270.7%27/%3E%3Ccircle cx=%2714%27 cy=%27116%27 r=%270.8%27/%3E%3Ccircle cx=%2737%27 cy=%27132%27 r=%270.7%27/%3E%3Ccircle cx=%2768%27 cy=%27118%27 r=%270.9%27/%3E%3Ccircle cx=%2798%27 cy=%27140%27 r=%270.7%27/%3E%3Ccircle cx=%27124%27 cy=%27122%27 r=%270.8%27/%3E%3Ccircle cx=%27146%27 cy=%27138%27 r=%270.6%27/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '160px 160px',
          mixBlendMode: 'soft-light',
        }}
      />

      <motion.div
        className="footer-left"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(28px, 5vw, 72px)',
          paddingRight: 'clamp(18px, 4vw, 40px)',
          position: 'relative',
          zIndex: 1,
          alignItems: 'center',
          textAlign: 'center',
          gap: 'clamp(24px, 5vw, 44px)',
        }}
      >
        <div>
          <motion.h2
            variants={revealUp(0.08, 26, 1.05)}
            style={{
              fontFamily: 'var(--font)',
              fontSize: 'clamp(88px, 31vw, 360px)',
              fontWeight: 900,
              lineHeight: 0.8,
              letterSpacing: '-0.05em',
              margin: 0,
              transform: 'scaleX(0.88)',
              transformOrigin: 'center center',
            }}
          >
            KU
          </motion.h2>
          <motion.h2
            variants={revealUp(0.3, 26, 1.05)}
            style={{
              fontFamily: 'var(--font)',
              fontSize: 'clamp(88px, 31vw, 360px)',
              fontWeight: 900,
              lineHeight: 0.8,
              letterSpacing: '-0.05em',
              margin: 0,
              transform: 'scaleX(0.88)',
              transformOrigin: 'center center',
            }}
          >
            lT
          </motion.h2>

          <motion.p
            variants={revealUp(0.52, 14, 0.85)}
            style={{
              marginTop: 'clamp(20px, 3vw, 34px)',
              marginBottom: 0,
              fontFamily: 'var(--font)',
              fontSize: 'clamp(11px, 2.8vw, 20px)',
              letterSpacing: 'clamp(0.2em, 1.7vw, 0.36em)',
              fontWeight: 600,
              color: '#F2EFEB',
            }}
          >
            {TAGLINE}
          </motion.p>

          <motion.div
            className="footer-location"
            variants={revealUp(0.74, 10, 0.8)}
            style={{ overflow: 'visible', marginTop: 'clamp(14px, 2.5vw, 28px)' }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font)',
                fontSize: 'clamp(8px, 1.9vw, 11px)',
                letterSpacing: 'clamp(0.2em, 1.2vw, 0.34em)',
                color: 'rgba(242,239,235,0.56)',
                lineHeight: 1.9,
                overflow: 'visible',
              }}
            >
              ASANSOL
              <br />
              INDIA
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="footer-right"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(28px, 5vw, 72px)',
          paddingLeft: 'clamp(18px, 4vw, 36px)',
          position: 'relative',
          zIndex: 1,
          alignItems: 'center',
          textAlign: 'center',
          gap: 'clamp(20px, 4vw, 36px)',
        }}
      >
        <div className="footer-right-content">
          <motion.h3
            variants={revealUp(0.95, 20, 0.95)}
            style={{
              margin: 0,
              marginBottom: 'clamp(28px, 3.4vw, 52px)',
              fontFamily: 'var(--font)',
              fontWeight: 800,
              fontSize: 'clamp(30px, 10.5vw, 84px)',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
            }}
          >
            LETS TALK
          </motion.h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            {CONTACT_LINKS.map((item, idx) => (
              <FooterLink
                key={item.label}
                href={item.href}
                label={item.label}
                external={item.external}
                delay={1.08 + idx * 0.12}
              />
            ))}
          </div>
        </div>

        <motion.p
          variants={revealUp(1.42, 8, 0.75)}
          style={{
            margin: 0,
            alignSelf: 'center',
            textAlign: 'center',
            fontFamily: 'var(--font)',
            fontSize: 'clamp(8px, 1.9vw, 11px)',
            letterSpacing: 'clamp(0.14em, 1vw, 0.24em)',
            color: 'rgba(242,239,235,0.52)',
          }}
        >
          ALL RIGHTS RESERVED{' '}
          <span style={{ color: '#C7B9A5' }}>
            {currentYear}
          </span>
        </motion.p>
      </motion.div>

      <style>{`
        @media (min-width: 900px) {
          .footer-root {
            flex-direction: row;
          }

          .footer-left {
            width: 60% !important;
            align-items: flex-start !important;
            text-align: left !important;
          }

          .footer-right {
            width: 40% !important;
            align-items: flex-start !important;
            text-align: left !important;
          }

          .footer-right-content {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
