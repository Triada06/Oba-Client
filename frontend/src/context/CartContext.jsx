import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCartFromStorage()
  }, [])

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart from storage:', error)
        localStorage.removeItem('cart')
      }
    }
  }

  const saveCartToStorage = (items) => {
    localStorage.setItem('cart', JSON.stringify(items))
  }

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id)
      
      let newItems
      if (existingItem) {
        newItems = prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        newItems = [...prevItems, { ...product, quantity }]
      }
      
      saveCartToStorage(newItems)
      toast.success(`${product.name} added to cart!`)
      return newItems
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item._id !== productId)
      saveCartToStorage(newItems)
      toast.success('Item removed from cart')
      return newItems
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      )
      saveCartToStorage(newItems)
      return newItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
    toast.success('Cart cleared')
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const syncCartWithServer = async () => {
    if (!cartItems.length) return

    try {
      setLoading(true)
      await api.post('/cart/sync', { items: cartItems })
    } catch (error) {
      console.error('Failed to sync cart with server:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    syncCartWithServer
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
