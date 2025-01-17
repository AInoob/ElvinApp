import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from 'lucide-react'
import './App.css'
import snakeHead from './assets/snake-head.svg'
import snakeBody from './assets/snake-body.svg'
import snakeTail from './assets/snake-tail.svg'

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }

const GridCell = memo(({ isSnake, isFood, segmentType, rotation }: { 
  isSnake: boolean, 
  isFood: boolean, 
  segmentType?: 'head' | 'body' | 'tail',
  rotation?: number 
}) => {
  const getSegmentImage = () => {
    switch (segmentType) {
      case 'head': return snakeHead;
      case 'tail': return snakeTail;
      case 'body': return snakeBody;
      default: return '';
    }
  };

  return (
    <div
      className={`w-6 h-6 relative ${
        isFood ? 'bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg shadow-red-500/50 scale-75' : ''
      }`}
    >
      {isSnake && (
        <div
          className="absolute inset-0 flex items-center justify-center transform-gpu"
          style={rotation !== undefined ? { transform: `rotate(${rotation}deg)` } : {}}
        >
          <img 
            src={getSegmentImage()} 
            alt="snake segment"
            className="w-full h-full object-contain will-change-transform"
          />
        </div>
      )}
    </div>
  );
});

function App() {
  const GRID_SIZE = 20
  const CELL_SIZE = 25
  const INITIAL_SNAKE = [{ x: 10, y: 10 }]
  const INITIAL_DIRECTION = 'RIGHT'
  const GAME_SPEED = 150

  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION)
  const [food, setFood] = useState<Position>({ x: 15, y: 10 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [lastMoveTime, setLastMoveTime] = useState(Date.now())
  
  const gridCells = useMemo(() => (
    Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
      const x = index % GRID_SIZE;
      const y = Math.floor(index / GRID_SIZE);
      const isSnake = snake.some(segment => segment.x === x && segment.y === y);
      const isFood = food.x === x && food.y === y;
      
      let segmentType: 'head' | 'body' | 'tail' | undefined;
      let rotation: number | undefined;
      
      if (isSnake) {
        if (x === snake[0].x && y === snake[0].y) {
          segmentType = 'head';
          if (snake.length > 1) {
            const [head, neck] = snake;
            if (head.x < neck.x) rotation = 180;
            else if (head.x > neck.x) rotation = 0;
            else if (head.y < neck.y) rotation = -90;
            else if (head.y > neck.y) rotation = 90;
          }
        } else if (x === snake[snake.length - 1].x && y === snake[snake.length - 1].y) {
          segmentType = 'tail';
        } else {
          segmentType = 'body';
        }
      }
      
      return (
        <GridCell
          key={index}
          isSnake={isSnake}
          isFood={isFood}
          segmentType={segmentType}
          rotation={rotation}
        />
      );
    })
  ), [snake, food, GRID_SIZE])

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    setFood(newFood)
  }, [])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setScore(0)
    setGameOver(false)
    generateFood()
  }

  const moveSnake = useCallback(() => {
    if (gameOver) return

    setSnake(prevSnake => {
      const head = prevSnake[0]
      const newHead = { ...head }

      switch (direction) {
        case 'UP':
          newHead.y = (newHead.y - 1 + GRID_SIZE) % GRID_SIZE
          break
        case 'DOWN':
          newHead.y = (newHead.y + 1) % GRID_SIZE
          break
        case 'LEFT':
          newHead.x = (newHead.x - 1 + GRID_SIZE) % GRID_SIZE
          break
        case 'RIGHT':
          newHead.x = (newHead.x + 1) % GRID_SIZE
          break
      }

      // Check if snake hits itself
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true)
        return prevSnake
      }

      const newSnake = [newHead, ...prevSnake]
      
      // Check if snake eats food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => prev + 1)
        generateFood()
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, gameOver, generateFood])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const now = Date.now();
      const timeSinceLastMove = now - lastMoveTime;
      
      // Allow immediate direction change if enough time has passed
      if (timeSinceLastMove >= GAME_SPEED * 0.5) {
        switch (e.key) {
          case 'ArrowUp':
            if (direction !== 'DOWN') {
              setDirection('UP');
              setLastMoveTime(now);
            }
            break;
          case 'ArrowDown':
            if (direction !== 'UP') {
              setDirection('DOWN');
              setLastMoveTime(now);
            }
            break;
          case 'ArrowLeft':
            if (direction !== 'RIGHT') {
              setDirection('LEFT');
              setLastMoveTime(now);
            }
            break;
          case 'ArrowRight':
            if (direction !== 'LEFT') {
              setDirection('RIGHT');
              setLastMoveTime(now);
            }
            break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, lastMoveTime, GAME_SPEED])

  useEffect(() => {
    if (!isPlaying) return

    const gameInterval = setInterval(moveSnake, GAME_SPEED)
    return () => clearInterval(gameInterval)
  }, [isPlaying, moveSnake])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">贪吃蛇游戏</h1>
      <div className="mb-4 text-2xl font-bold text-green-400">Score: {score}</div>
      
      <div className="relative bg-gray-800 rounded-lg p-4">
        <div 
          className="grid gap-px bg-gray-700"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
          }}
        >
          {gridCells}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="mb-4">Final Score: {score}</p>
              <Button 
                onClick={resetGame}
                className="bg-green-500 hover:bg-green-600"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 transition-all duration-200"
          disabled={gameOver}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          onClick={resetGame}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-gray-300 text-sm font-medium">
          使用键盘方向键 ← ↑ → ↓ 控制蛇的移动
        </p>
      </div>
    </div>
  )
}

export default App
