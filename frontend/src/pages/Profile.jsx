import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Gamepad2, Trophy, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useGame } from '../context/GameContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const { gameState } = useGame()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || {}
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setProfileData({
        ...profileData,
        address: {
          ...profileData.address,
          [field]: value
        }
      })
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updateProfile(profileData)
      if (result.success) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'game', label: 'Game Stats', icon: Gamepad2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="input bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={profileData.address.city || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={profileData.address.street || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={profileData.address.zipCode || ''}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'game' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Game Stats */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Trophy size={24} className="text-yellow-500" />
                  Game Statistics
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-yellow-100 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-800 mb-2">
                      {gameState.userBonuses}
                    </div>
                    <div className="text-yellow-700">Total Bonuses</div>
                  </div>
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="text-3xl font-bold text-green-800 mb-2">
                      {gameState.gameHistory.length}
                    </div>
                    <div className="text-green-700">Games Played</div>
                  </div>
                  <div className="text-center p-4 bg-blue-100 rounded-lg">
                    <div className="text-3xl font-bold text-blue-800 mb-2">
                      {gameState.gameHistory.filter(game => game.bonusEarned > 0).length}
                    </div>
                    <div className="text-blue-700">Games Won</div>
                  </div>
                </div>
              </div>

              {/* Recent Games */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Games</h3>
                
                {gameState.gameHistory.length > 0 ? (
                  <div className="space-y-3">
                    {gameState.gameHistory.slice(0, 5).map((game, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{game.productName}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(game.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">+{game.bonusEarned}</div>
                          <div className="text-sm text-gray-600">{game.accuracy}% accuracy</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No games played yet. Start playing to earn bonuses!
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={user?.preferences?.notifications?.email}
                        className="mr-3"
                      />
                      Email notifications
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={user?.preferences?.notifications?.push}
                        className="mr-3"
                      />
                      Push notifications
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={user?.preferences?.notifications?.sms}
                        className="mr-3"
                      />
                      SMS notifications
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mr-3"
                      />
                      Allow AI recommendations
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mr-3"
                      />
                      Share game statistics
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary">
                  Save Settings
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
