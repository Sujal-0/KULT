import React, { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export const CART_SIZES = ['XS', 'S', 'M', 'L', 'XL']

/* "₹ 4,200" → 4200 */
export const parsePrice = (str) =>
  parseInt((str || '').replace(/[^0-9]/g, ''), 10) || 0

/* 4200 → "₹ 4,200" */
export const formatPrice = (num) =>
  '₹ ' + Number(num).toLocaleString('en-IN')

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  /* composite key avoids adding same product+size twice */
  const addItem = useCallback((product, size) => {
    const key = `${product.id}::${size}`
    setItems(prev => {
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, {
        id     : `${key}::${Date.now()}`,
        key,
        product,
        size,
        qty    : 1,
      }]
    })
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  /* If changed size already exists → merge quantities */
  const updateSize = useCallback((id, newSize) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (!item) return prev
      const newKey = `${item.product.id}::${newSize}`
      const twin   = prev.find(i => i.key === newKey && i.id !== id)
      if (twin) {
        return prev
          .map(i => i.key === newKey ? { ...i, qty: i.qty + item.qty } : i)
          .filter(i => i.id !== id)
      }
      return prev.map(i => i.id === id ? { ...i, size: newSize, key: newKey } : i)
    })
  }, [])

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + parsePrice(i.product.price) * i.qty, 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateSize,
      totalCount,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
