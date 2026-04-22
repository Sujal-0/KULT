import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CartProvider }  from '../context/CartContext'
import Navbar        from '../components/navbar/Navbar'
import Hero          from '../components/hero/Hero'
import CategorySplit from '../components/category/CategorySplit'
import Footer        from '../components/footer/Footer'
import ProductPage   from '../components/products/ProductPage'
import ProductDetail from '../components/products/ProductDetail'
import CartPage      from '../components/cart/CartPage'
import ComingSoon    from '../components/comingsoon/ComingSoon'

/* ── Page-flip transition — used by every page swap ─────────── */
const flipVariants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.97,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -40,
    scale: 0.96,
    transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
  },
}

/* How long to wait before firing a pending scroll after page mounts.
   Must be >= the enter animation duration (0.85s) + a small buffer.  */
const ENTER_MS = 950

/* ─── Lenis scroll helper ────────────────────────────────────── */
function scrollToId(targetId, delay = 0) {
  const fire = () => {
    if (window.__lenis) window.__lenis.update?.()
    const el = document.getElementById(targetId)
    if (!el) return
    if (window.__lenis) {
      window.__lenis.scrollTo(el, {
        duration: 1.4,
        easing  : t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
  if (delay > 0) {
    setTimeout(fire, delay)
  } else {
    fire()
  }
}

function scrollToTop(immediate = true) {
  if (window.__lenis) {
    window.__lenis.scrollTo(0, { immediate })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}

/* ─── Inner app ─────────────────────────────────────────────── */
function AppInner() {
  const [activePage,    setActivePage]    = useState(null)   // null | 'mens' | 'womens'
  const [activeProduct, setActiveProduct] = useState(null)   // null | product object
  const [showCart,      setShowCart]      = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)

  /* targetId to scroll to once the main page re-mounts */
  const pendingScroll = useRef(null)

  /* Derived flags */
  const onSubPage = showCart || showComingSoon || activePage !== null || activeProduct !== null

  /* ── Fire pending scroll when main page re-mounts ── */
  useEffect(() => {
    if (onSubPage) return                      // not on main page yet
    if (!pendingScroll.current) return
    const targetId = pendingScroll.current
    pendingScroll.current = null
    const timer = setTimeout(() => scrollToId(targetId), ENTER_MS)
    return () => clearTimeout(timer)
  }, [activePage, activeProduct, showCart])    // eslint-disable-line

  /* ────────────────────────────────────────────────────────────
     NAVIGATION ACTIONS
  ──────────────────────────────────────────────────────────── */

  /* Category card clicked → gender product page */
  const navigate = (page) => {
    setActivePage(page)
    setTimeout(scrollToTop, 80)
  }

  /* ProductPage back → main, scroll to #category */
  const goBack = () => {
    pendingScroll.current = 'category'
    setActivePage(null)
  }

  /* Product card clicked → product detail */
  const openProduct = (product) => {
    setActiveProduct(product)
    setTimeout(scrollToTop, 80)
  }

  /* ProductDetail back → restore ProductPage (or main if direct) */
  const closeProduct = () => {
    // If we came from a gender page, go back to it; otherwise back to main
    if (activePage) {
      setActiveProduct(null)   // ProductPage is still in activePage — stays mounted
    } else {
      pendingScroll.current = 'category'
      setActiveProduct(null)
    }
  }

  /* Cart open / close */
  const openCart       = () => { setShowCart(true);       setTimeout(scrollToTop, 80) }
  const closeCart      = () => { setShowCart(false) }

  /* Coming soon open / close */
  const openComingSoon  = () => { setShowComingSoon(true);  setTimeout(scrollToTop, 80) }
  const closeComingSoon = () => { setShowComingSoon(false) }

  /* ── Logo click — called by Navbar with the target section id ──
     Navbar passes 'hero' when logo is clicked.
     If we're on a sub-page, we first return to main then scroll.   */
  const navigateTo = (targetId) => {
    if (onSubPage) {
      pendingScroll.current = targetId   // will fire after main re-mounts
      setShowCart(false)
      setActiveProduct(null)
      setActivePage(null)
    } else {
      // Already on main page — just scroll
      scrollToId(targetId)
    }
  }

  /* ── Page key for AnimatePresence ── */
  const pageKey = showComingSoon
    ? 'coming-soon'
    : showCart
      ? 'cart'
      : activeProduct
        ? `detail-${activeProduct.id}`
        : activePage
          ? activePage
          : 'main'

  return (
    <div style={{ perspective: '1200px', perspectiveOrigin: '50% 30%' }}>
      <AnimatePresence mode="wait">

        {/* ════════════════════════
            COMING SOON PAGE
        ════════════════════════ */}
        {showComingSoon ? (
          <motion.div
            key="coming-soon"
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minHeight: '100vh' }}
          >
            <Navbar
              isProductPage={false}       /* dark bg — cream logo */
              hideActionButton={true}
              hamburgerLight={true}       /* dark bg — always light hamburger */
              onNavigateTo={navigateTo}
              onOpenCart={openCart}
              onBack={closeComingSoon}    /* ← BACK returns to cart */
            />
            <ComingSoon />
          </motion.div>

        /* ════════════════════════
            CART PAGE
        ════════════════════════ */
        ) : showCart ? (
          <motion.div
            key="cart"
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minHeight: '100vh' }}
          >
            <Navbar
              isProductPage={true}      /* off-white bg — dark logo block + dark hamburger */
              hideActionButton={true}   /* BUY NOW / PRODUCTS hidden — footer has BUY */
              hamburgerLight={false}    /* off-white bg everywhere — dark hamburger */
              onNavigateTo={navigateTo}
              onOpenCart={openCart}     /* badge click on cart page is a no-op visually
                                          (badge hidden when hideActionButton=true)   */
              onBack={closeCart}        /* ← BACK shown in place of action button     */
            />
            <CartPage onClose={closeCart} onBuy={openComingSoon} />
          </motion.div>

        /* ════════════════════════
            PRODUCT DETAIL
        ════════════════════════ */
        ) : activeProduct ? (
          <motion.div
            key={`detail-${activeProduct.id}`}
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minHeight: '100vh' }}
          >
            <Navbar
              isProductPage={true}
              hideActionButton={false}
              cartLabelDark={true}        /* off-white bg on desktop — dark BASKET text */
              hamburgerLight={false}      /* off-white bg everywhere — dark hamburger */
              onNavigateTo={navigateTo}
              onOpenCart={openCart}
              /* no onBack — ProductDetail has its own ← PRODUCTS sidebar button */
            />
            <ProductDetail
              product={activeProduct}
              onBack={closeProduct}
              onOpenCart={openCart}
            />
          </motion.div>

        /* ════════════════════════
            GENDER PRODUCT PAGE
        ════════════════════════ */
        ) : activePage ? (
          <motion.div
            key={activePage}
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minHeight: '100vh' }}
          >
            <Navbar
              isProductPage={true}
              hideActionButton={false}
              cartLabelDark={false}       /* dark bg on desktop — light BASKET text */
              hamburgerLight={null}       /* null = light desktop (dark bg) / dark mobile (off-white bg) */
              onNavigateTo={navigateTo}
              onOpenCart={openCart}
            />
            <ProductPage
              gender={activePage}
              onBack={goBack}
              onProductSelect={openProduct}
            />
          </motion.div>

        /* ════════════════════════
            MAIN (Hero + Category + Footer)
        ════════════════════════ */
        ) : (
          <motion.main
            key="main"
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ background: 'var(--bg)', minHeight: '100vh' }}
          >
            <Navbar
              isProductPage={false}
              hideActionButton={false}
              hideCartBadge={true}
              hamburgerLight={true}       /* hero dark video bg — always light hamburger */
              onNavigateTo={navigateTo}
              onOpenCart={openCart}
            />
            <section id="hero">
              <Hero />
            </section>
            <section id="category">
              <CategorySplit onNavigate={navigate} />
            </section>
            <Footer />
          </motion.main>
        )}

      </AnimatePresence>
    </div>
  )
}

/* ─── Home: wraps AppInner with CartProvider ─────────────────── */
export default function Home() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  )
}