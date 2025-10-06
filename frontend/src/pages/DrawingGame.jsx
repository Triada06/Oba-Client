import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Palette, 
  Eraser, 
  RotateCcw, 
  Check, 
  X, 
  Trophy,
  Clock,
  Sparkles,
  Download,
  Upload
} from 'lucide-react'
import { useGame } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const DrawingGame = () => {
  const canvasRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(5)
  const [brushColor, setBrushColor] = useState('#000000')
  const [currentTool, setCurrentTool] = useState('brush')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  
  const { 
    gameState, 
    loading, 
    getDailyChallenge, 
    submitDrawing 
  } = useGame()
  const { user } = useAuth()

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#008000', '#FFC0CB', '#A52A2A'
  ]

  useEffect(() => {
    if (!gameState.dailyChallenge) {
      getDailyChallenge()
    }
  }, [gameState.dailyChallenge, getDailyChallenge])

  useEffect(() => {
    let interval
    if (gameStarted && timeLeft > 0 && !gameCompleted) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameStarted) {
      handleSubmitDrawing()
    }
    return () => clearInterval(interval)
  }, [gameStarted, timeLeft, gameCompleted])

  useEffect(() => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current
      const ctx = canvasElement.getContext('2d')
      
      // Set canvas size
      canvasElement.width = 400
      canvasElement.height = 400
      
      // Set default styles
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height)
      
      setCanvas(canvasElement)
    }
  }, [])

  const startDrawing = (e) => {
    if (!gameStarted) return
    
    setIsDrawing(true)
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing || !gameStarted) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = currentTool === 'eraser' ? 'rgba(0,0,0,1)' : brushColor
    ctx.lineWidth = currentTool === 'eraser' ? brushSize * 2 : brushSize
    
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
  }

  const clearCanvas = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const startGame = () => {
    if (!gameState.dailyChallenge) {
      toast.error('No daily challenge available')
      return
    }
    
    setGameStarted(true)
    setTimeLeft(300)
    setGameCompleted(false)
    clearCanvas()
    toast.success('Game started! You have 5 minutes to draw the product.')
  }

  const handleSubmitDrawing = async () => {
    if (!canvas || !gameState.dailyChallenge) return
    
    try {
      const drawingData = canvas.toDataURL('image/png')
      const result = await submitDrawing(drawingData, gameState.dailyChallenge.productId)
      
      if (result.success) {
        setGameCompleted(true)
        setGameStarted(false)
        toast.success(`Congratulations! You earned ${result.bonusEarned} bonuses!`)
      }
    } catch (error) {
      toast.error('Failed to submit drawing')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  if (!gameState.dailyChallenge) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Trophy size={64} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-4">No Challenge Available</h2>
          <p className="text-gray-600 mb-6">
            Check back tomorrow for a new daily drawing challenge!
          </p>
          <button
            onClick={() => getDailyChallenge()}
            className="btn btn-primary"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy size={32} className="text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Daily Drawing Challenge</h1>
          </div>
          <p className="text-gray-600 mb-4">
            Draw the product below and earn bonuses! You have 5 minutes to complete your drawing.
          </p>
          
          {/* User Stats */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="bg-yellow-100 px-4 py-2 rounded-lg">
              <span className="text-yellow-800 font-bold">{gameState.userBonuses}</span>
              <span className="text-yellow-600 ml-1">Bonuses</span>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <span className="text-green-800 font-bold">{gameState.gameHistory.length}</span>
              <span className="text-green-600 ml-1">Games Played</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product to Draw */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 text-center">Draw This Product</h2>
              <div className="text-center">
                <img
                  src={gameState.dailyChallenge.productImage}
                  alt={gameState.dailyChallenge.productName}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-md"
                />
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  {gameState.dailyChallenge.productName}
                </h3>
                <p className="text-gray-600 text-sm">
                  {gameState.dailyChallenge.productDescription}
                </p>
              </div>
            </div>

            {/* Game Controls */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Game Controls</h3>
                {gameStarted && (
                  <div className="flex items-center gap-2 text-red-600">
                    <Clock size={20} />
                    <span className="font-bold">{formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>

              {!gameStarted && !gameCompleted && (
                <button
                  onClick={startGame}
                  className="btn btn-primary w-full mb-4"
                  disabled={!gameState.canPlayToday}
                >
                  {gameState.canPlayToday ? 'Start Drawing' : 'Already Played Today'}
                </button>
              )}

              {gameStarted && !gameCompleted && (
                <div className="space-y-4">
                  {/* Tools */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentTool('brush')}
                      className={`p-2 rounded ${currentTool === 'brush' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                      <Palette size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentTool('eraser')}
                      className={`p-2 rounded ${currentTool === 'eraser' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    >
                      <Eraser size={20} />
                    </button>
                    <button
                      onClick={clearCanvas}
                      className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <RotateCcw size={20} />
                    </button>
                  </div>

                  {/* Brush Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Brush Size</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600">{brushSize}px</div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Colors</label>
                    <div className="grid grid-cols-6 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setBrushColor(color)}
                          className={`w-8 h-8 rounded border-2 ${
                            brushColor === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitDrawing}
                    className="btn btn-primary w-full"
                  >
                    <Check size={20} />
                    Submit Drawing
                  </button>
                </div>
              )}

              {gameCompleted && (
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-4 mb-4">
                    <Check size={32} className="mx-auto mb-2 text-green-600" />
                    <h3 className="text-lg font-bold text-green-800">Drawing Submitted!</h3>
                    <p className="text-green-600">Check back tomorrow for a new challenge!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Drawing Canvas */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Your Drawing</h3>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="border-2 border-gray-300 rounded-lg cursor-crosshair"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    touchAction: 'none'
                  }}
                />
              </div>
              
              {!gameStarted && !gameCompleted && (
                <div className="text-center mt-4">
                  <p className="text-gray-500 text-sm">
                    Click "Start Drawing" to begin the challenge
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">How to Play</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p>Look at the product image and try to draw it as accurately as possible</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p>Use different colors and brush sizes to create your drawing</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p>Submit your drawing before time runs out</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <p>AI will analyze your drawing and award bonuses based on accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Conversion */}
        {gameState.userBonuses > 0 && (
          <div className="mt-8">
            <div className="card p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles size={24} className="text-yellow-500" />
                <h3 className="text-xl font-bold">Convert Your Bonuses</h3>
              </div>
              <p className="text-gray-600 mb-4">
                You have {gameState.userBonuses} bonuses. Convert them to discounts!
              </p>
              <div className="flex justify-center gap-4">
                <button className="btn btn-yellow">
                  Convert 50 → 5% Discount
                </button>
                <button className="btn btn-yellow">
                  Convert 100 → 10% Discount
                </button>
                <button className="btn btn-yellow">
                  Convert 200 → 20% Discount
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DrawingGame
