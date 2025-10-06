import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Sparkles,
  Eye
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

const ProductCard = ({ product, showAiBadge = false }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Quick view functionality can be implemented later
    toast.info('Quick view coming soon!')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('az-AZ', {
      style: 'currency',
      currency: 'AZN'
    }).format(price)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={14} className="fill-yellow-400/50 text-yellow-400" />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} className="text-gray-300" />
      )
    }

    return stars
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="card group"
    >
      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* AI Badge */}
          {showAiBadge && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Sparkles size={12} />
              AI Pick
            </div>
          )}

          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{product.discount}%
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button
                onClick={handleQuickView}
                className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
                title="Quick View"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                title="Add to Cart"
              >
                <ShoppingCart size={16} />
              </button>
              <button
                className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
                title="Add to Wishlist"
              >
                <Heart size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
              {product.category}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {renderStars(product.rating || 0)}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>by {product.seller?.name || 'Oba Seller'}</span>
            <span className="text-green-600 font-medium">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
