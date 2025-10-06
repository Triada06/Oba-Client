import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'
import toast from 'react-hot-toast'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    dailyChallenge: null,
    userBonuses: 0,
    gameHistory: [],
    canPlayToday: true,
    lastPlayDate: null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadGameState()
  }, [])

  const loadGameState = async () => {
    try {
      setLoading(true)
      const response = await api.get('/game/state')
      setGameState(response.data)
    } catch (error) {
      console.error('Failed to load game state:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDailyChallenge = async () => {
    try {
      setLoading(true)
      const response = await api.get('/game/daily-challenge')
      setGameState(prev => ({
        ...prev,
        dailyChallenge: response.data.challenge
      }))
      return response.data.challenge
    } catch (error) {
      console.error('Failed to get daily challenge:', error)
      toast.error('Failed to load daily challenge')
      return null
    } finally {
      setLoading(false)
    }
  }

  const submitDrawing = async (drawingData, productId) => {
    try {
      setLoading(true)
      const response = await api.post('/game/submit-drawing', {
        drawingData,
        productId,
        challengeId: gameState.dailyChallenge?.id
      })

      const { success, bonusEarned, accuracy } = response.data

      if (success) {
        setGameState(prev => ({
          ...prev,
          userBonuses: prev.userBonuses + bonusEarned,
          canPlayToday: false,
          lastPlayDate: new Date().toISOString(),
          gameHistory: [
            ...prev.gameHistory,
            {
              id: Date.now(),
              productId,
              bonusEarned,
              accuracy,
              date: new Date().toISOString()
            }
          ]
        }))

        toast.success(`Great job! You earned ${bonusEarned} bonuses!`)
        return { success: true, bonusEarned, accuracy }
      } else {
        toast.error('Drawing not recognized. Try again!')
        return { success: false }
      }
    } catch (error) {
      console.error('Failed to submit drawing:', error)
      toast.error('Failed to submit drawing')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const convertBonusesToDiscount = async (bonusAmount) => {
    try {
      setLoading(true)
      const response = await api.post('/game/convert-bonuses', {
        bonusAmount
      })

      const { discountCode, discountAmount } = response.data

      setGameState(prev => ({
        ...prev,
        userBonuses: prev.userBonuses - bonusAmount
      }))

      toast.success(`Converted ${bonusAmount} bonuses to ${discountAmount}% discount!`)
      return { success: true, discountCode, discountAmount }
    } catch (error) {
      console.error('Failed to convert bonuses:', error)
      toast.error('Failed to convert bonuses')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const resetDailyChallenge = () => {
    setGameState(prev => ({
      ...prev,
      canPlayToday: true,
      dailyChallenge: null
    }))
  }

  const value = {
    gameState,
    loading,
    getDailyChallenge,
    submitDrawing,
    convertBonusesToDiscount,
    resetDailyChallenge,
    loadGameState
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}
