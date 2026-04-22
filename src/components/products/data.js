/* ─── Image imports — Vite resolves these to hashed URLs ─── */

/* MENS */
import m1Main from '../../assets/mens/product1/main1.jpg'
import m1Alt1 from '../../assets/mens/product1/alt1.1.jpg'

import m2Main from '../../assets/mens/product2/main2.jpg'
import m2Alt1 from '../../assets/mens/product2/alt2.1.jpg'
import m2Alt2 from '../../assets/mens/product2/alt2.2.jpg'

import m3Main from '../../assets/mens/product3/main3.jpg'
import m3Alt1 from '../../assets/mens/product3/alt3.1.jpg'
import m3Alt2 from '../../assets/mens/product3/alt3.2.jpg'

import m4Main from '../../assets/mens/product4/main4.jpg'
import m4Alt1 from '../../assets/mens/product4/alt4.1.jpg'
import m4Alt2 from '../../assets/mens/product4/alt4.2.jpg'

import m5Main from '../../assets/mens/product5/main5.jpg'
import m5Alt1 from '../../assets/mens/product5/alt5.1.jpg'

import m6Main from '../../assets/mens/product6/main6.jpg'
import m6Alt1 from '../../assets/mens/product6/alt6.1.jpg'
import m6Alt2 from '../../assets/mens/product6/alt6.2.jpg'

/* WOMENS */
import w1Main from '../../assets/womens/product1/w1-main.jpg'
import w1Alt1 from '../../assets/womens/product1/w1-alt1.jpg'
import w1Alt2 from '../../assets/womens/product1/w1-alt2.jpg'

import w2Main from '../../assets/womens/product2/w2-main.jpg'
import w2Alt  from '../../assets/womens/product2/w2-alt.jpg'

import w3Main from '../../assets/womens/product3/w3-main.jpg'
import w3Alt1 from '../../assets/womens/product3/w3-alt1.jpg'
import w3Alt2 from '../../assets/womens/product3/w3-alt2.jpg'

import w4Main from '../../assets/womens/product4/w4-main.jpg'
import w4Alt1 from '../../assets/womens/product4/w4-alt1.jpg'
import w4Alt2 from '../../assets/womens/product4/w4-alt2.jpg'

import w5Main from '../../assets/womens/product5/w5-main.jpg'
import w5Alt1 from '../../assets/womens/product5/w5-alt1.jpg'
import w5Alt2 from '../../assets/womens/product5/w5-alt2.jpg'

import w6Main from '../../assets/womens/product6/w6-main.jpg'
import w6Alt1 from '../../assets/womens/product6/w6-alt1.jpg'
import w6Alt2 from '../../assets/womens/product6/w6-alt2.jpg'

/* ─── Products ─────────────────────────────────────────────── */
/*
  altA / altB — optional alt images.
  ProductCard uses: product.altA || product.image  (fallback to main)
                    product.altB || product.image
*/

export const MENS_PRODUCTS = [
  {
    id   : 'M001',
    name : 'DRIFT OVERSIZED TEE',
    price: '₹ 4,200',
    tag  : 'SS 26',
    image: m1Main,
    altA : m1Alt1,
    altB : null,        // fallback → main
    cardBg: 'radial-gradient(ellipse at 50% 30%, #272420 0%, #111 55%, #090909 100%)',
  },
  {
    id   : 'M002',
    name : 'CARGO UTILITY PANT',
    price: '₹ 7,800',
    tag  : 'SS 26',
    image: m2Main,
    altA : m2Alt1,
    altB : m2Alt2,
    cardBg: 'radial-gradient(ellipse at 50% 25%, #1f2520 0%, #0e110e 55%, #090909 100%)',
  },
  {
    id   : 'M003',
    name : 'SHELL BOMBER',
    price: '₹ 12,500',
    tag  : 'SS 26',
    image: m3Main,
    altA : m3Alt1,
    altB : m3Alt2,
    cardBg: 'radial-gradient(ellipse at 50% 35%, #1a1e24 0%, #0e1014 55%, #090909 100%)',
  },
  {
    id   : 'M004',
    name : 'HOODED SHELL',
    price: '₹ 9,200',
    tag  : 'SS 26',
    image: m4Main,
    altA : m4Alt1,
    altB : m4Alt2,
    cardBg: 'radial-gradient(ellipse at 50% 28%, #211e1a 0%, #111 55%, #090909 100%)',
  },
  {
    id   : 'M005',
    name : 'TACTICAL VEST',
    price: '₹ 5,600',
    tag  : 'SS 26',
    image: m5Main,
    altA : m5Alt1,
    altB : null,        // fallback → main
    cardBg: 'radial-gradient(ellipse at 50% 30%, #1c1c1c 0%, #101010 55%, #090909 100%)',
  },
  {
    id   : 'M006',
    name : 'RELAXED TRACK PANT',
    price: '₹ 6,400',
    tag  : 'SS 26',
    image: m6Main,
    altA : m6Alt1,
    altB : m6Alt2,
    cardBg: 'radial-gradient(ellipse at 50% 32%, #1e1c20 0%, #100f12 55%, #090909 100%)',
  },
]

export const WOMENS_PRODUCTS = [
  {
    id   : 'W001',
    name : 'SILHOUETTE DRESS',
    price: '₹ 8,900',
    tag  : 'SS 26',
    image: w1Main,
    altA : w1Alt1,
    altB : w1Alt2,
    cardBg: 'radial-gradient(ellipse at 50% 28%, #241e1e 0%, #130e0e 55%, #090909 100%)',
  },
  {
    id   : 'W002',
    name : 'WRAPPED MIDI SKIRT',
    price: '₹ 5,800',
    tag  : 'SS 26',
    image: w2Main,
    altA : w2Alt,
    altB : null,        // fallback → main
    cardBg: 'radial-gradient(ellipse at 50% 32%, #201e24 0%, #100f14 55%, #090909 100%)',
  },
  {
    id   : 'W003',
    name : 'OVERSIZED TRENCH',
    price: '₹ 14,200',
    tag  : 'SS 26',
    image: w3Main,
    altA : w3Alt1,
    altB : w3Alt2,
    cardBg: 'radial-gradient(ellipse at 50% 26%, #201e18 0%, #11100d 55%, #090909 100%)',
  },
  {
    id   : 'W004',
    name : 'CARGO WIDE LEG',
    price: '₹ 6,900',
    tag  : 'SS 26',
    image: w4Main,
    altA : w4Alt1,
    altB : w4Alt2,
    cardBg: 'radial-gradient(ellipse at 50% 30%, #1a2020 0%, #0e1212 55%, #090909 100%)',
  },
  {
    id   : 'W005',
    name : 'CROPPED MOTO JACKET',
    price: '₹ 11,500',
    tag  : 'SS 26',
    image: w5Main,
    altA : w5Alt1,
    altB : w5Alt2,
    cardBg: 'radial-gradient(ellipse at 50% 29%, #1c1c20 0%, #101012 55%, #090909 100%)',
  },
  {
    id   : 'W006',
    name : 'UTILITY SLIP DRESS',
    price: '₹ 7,400',
    tag  : 'SS 26',
    image: w6Main,
    altA : w6Alt1,
    altB : w6Alt2,
    cardBg: 'radial-gradient(ellipse at 50% 33%, #22201e 0%, #121110 55%, #090909 100%)',
  },
]
