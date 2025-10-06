import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Gamepad2, 
  Sparkles,
  ShoppingBag,
  Users,
  Award
} from 'lucide-react'
import { api } from '../utils/api'
import ProductCard from '../components/Product/ProductCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [aiRecommendations, setAiRecommendations] = useState([])

  // Fetch featured products
  const { data: products, isLoading: productsLoading } = useQuery(
    'featured-products',
    () => api.get('/products/featured'),
    {
      select: (response) => response.data.products
    }
  )

  // Fetch AI recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery(
    'ai-recommendations',
    () => api.get('/products/ai-recommendations'),
    {
      select: (response) => response.data.recommendations,
      enabled: !!products
    }
  )

  useEffect(() => {
    if (products) setFeaturedProducts(products)
    if (recommendations) setAiRecommendations(recommendations)
  }, [products, recommendations])

  const stats = [
    { icon: ShoppingBag, label: 'Products', value: '10,000+' },
    { icon: Users, label: 'Customers', value: '50,000+' },
    { icon: Award, label: 'Satisfaction', value: '98%' },
    { icon: TrendingUp, label: 'Growth', value: '25%' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Welcome to{' '}
                <span className="text-yellow-300">Oba</span>
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Discover amazing products with AI-powered recommendations and earn bonuses through our fun drawing game!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="btn btn-yellow text-lg px-8 py-3 inline-flex items-center gap-2"
                >
                  Shop Now
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/game"
                  className="btn btn-secondary text-lg px-8 py-3 inline-flex items-center gap-2"
                >
                  <Gamepad2 size={20} />
                  Play Game
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center">
                  <Sparkles size={48} className="mx-auto mb-4 text-yellow-300" />
                  <h3 className="text-2xl font-bold mb-2">AI-Powered Shopping</h3>
                  <p className="text-green-100">
                    Our AI learns from your preferences to show you the perfect products
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={24} className="text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the best products from local Azerbaijani sellers
            </p>
          </div>

          {productsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn btn-primary text-lg px-8 py-3 inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles size={32} className="text-green-500" />
                <h2 className="text-3xl font-bold text-gray-900">AI Recommendations</h2>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Personalized just for you based on your browsing history and preferences
              </p>
            </div>

            {recommendationsLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {aiRecommendations.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} showAiBadge />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Game Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Daily Drawing Challenge
              </h2>
              <p className="text-lg text-gray-800 mb-8">
                Draw the daily product and earn bonuses! Convert your bonuses into discounts and special offers.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <span className="text-gray-800">Draw the daily product</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <span className="text-gray-800">AI detects your drawing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <span className="text-gray-800">Earn bonuses and discounts</span>
                </div>
              </div>
              <Link
                to="/game"
                className="btn btn-primary text-lg px-8 py-3 inline-flex items-center gap-2 mt-8"
              >
                <Gamepad2 size={20} />
                Start Playing
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                  <Gamepad2 size={64} className="mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Fun & Rewards</h3>
                  <p className="text-gray-600 mb-6">
                    Play once daily and earn bonuses that can be converted to real discounts
                  </p>
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-600 mb-2">+50</div>
                    <div className="text-green-700">Bonuses per successful drawing</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
