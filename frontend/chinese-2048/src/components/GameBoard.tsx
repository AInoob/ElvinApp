import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DYNASTY_COLORS } from '../constants/dynastyColors';

interface Tile {
  value: number;
  position: [number, number];
  prevPosition?: [number, number];
  id: number;
  isNew?: boolean;
  mergedFrom?: Tile[];
}

interface TouchPosition {
  x: number;
  y: number;
}

export const GameBoard: React.FC = () => {
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const gridSize = 4;

  const getDynastyForValue = (value: number) => {
    return DYNASTY_COLORS.find(d => d.value === value);
  };

  const initializeBoard = () => {
    try {
      console.log('Initializing board...');
      const newTiles: Tile[] = [];
      addRandomTile(newTiles);
      addRandomTile(newTiles);
      console.log('New tiles:', newTiles);
      if (newTiles.length === 0) {
        console.error('Failed to create initial tiles');
      }
      setTiles(newTiles);
      setScore(0);
    } catch (error) {
      console.error('Error initializing board:', error);
    }
  };

  const addRandomTile = (currentTiles: Tile[]) => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (!currentTiles.some(tile => tile.position[0] === i && tile.position[1] === j)) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newValue = Math.random() < 0.9 ? 2 : 4;
      currentTiles.push({
        value: newValue,
        position: randomCell,
        id: Date.now() * 1000 + Math.floor(Math.random() * 1000),
        isNew: true
      });
    }
  };

  const moveTiles = React.useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const newTiles = [...tiles];
    let moved = false;

    console.log('Before move - All tiles:', JSON.stringify(newTiles.map(t => ({
    value: t.value,
    dynasty: getDynastyForValue(t.value)?.dynasty,
    position: t.position,
    mergedFrom: t.mergedFrom
  })), null, 2));

  // Sort tiles based on direction to process them in correct order
  const sortedTiles = newTiles.sort((a, b) => {
    if (direction === 'up') return a.position[0] - b.position[0];
    if (direction === 'down') return b.position[0] - a.position[0];
    if (direction === 'left') return a.position[1] - b.position[1];
    return b.position[1] - a.position[1];
  });

    sortedTiles.forEach(tile => {
      let [row, col] = tile.position;
      // Store previous position before moving
      tile.prevPosition = [...tile.position];
      let newRow = row;
      let newCol = col;

      // Calculate new position
      while (true) {
        let nextRow = newRow + (direction === 'up' ? -1 : direction === 'down' ? 1 : 0);
        let nextCol = newCol + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0);

        if (nextRow < 0 || nextRow >= gridSize || nextCol < 0 || nextCol >= gridSize) break;

        const nextTile = newTiles.find(t => t.position[0] === nextRow && t.position[1] === nextCol);
        if (!nextTile) {
          newRow = nextRow;
          newCol = nextCol;
          moved = true;
        } else if (nextTile.value === tile.value && !nextTile.mergedFrom) {
          // Debug logging for merges
          const mergeResult = {
            before: {
              tile1: { value: tile.value, dynasty: getDynastyForValue(tile.value)?.dynasty },
              tile2: { value: nextTile.value, dynasty: getDynastyForValue(nextTile.value)?.dynasty }
            }
          };
          console.log('🔄 Attempting merge:', mergeResult.before);
          
          // Merge tiles
          nextTile.value *= 2;
          nextTile.mergedFrom = [tile];
          setScore(prev => prev + nextTile.value);
          const index = newTiles.indexOf(tile);
          newTiles.splice(index, 1);
          moved = true;

          const afterDynasty = getDynastyForValue(nextTile.value);
          console.log('✨ Merge successful:', {
            newValue: nextTile.value,
            dynasty: afterDynasty?.dynasty,
            position: nextTile.position,
            totalTiles: newTiles.length,
            score: score + nextTile.value
          });
          
          // Log progression milestones
          if (nextTile.value >= 256) {
            console.log('🎯 MILESTONE:', {
              achievement: `Reached ${afterDynasty?.dynasty}(${nextTile.value})!`,
              position: nextTile.position,
              score
            });
          }
          break;
        } else {
          break;
        }
      }

      if (newRow !== row || newCol !== col) {
        tile.position = [newRow, newCol];
      }
    });

    // Reset merge flags after processing all moves
    console.log('Before resetting mergedFrom flags:', JSON.stringify(newTiles.map(t => ({
      value: t.value,
      dynasty: getDynastyForValue(t.value)?.dynasty,
      mergedFrom: t.mergedFrom
    })), null, 2));

    newTiles.forEach(tile => {
      if (tile.mergedFrom) {
        delete tile.mergedFrom;
      }
    });

    console.log('After resetting mergedFrom flags:', JSON.stringify(newTiles.map(t => ({
      value: t.value,
      dynasty: getDynastyForValue(t.value)?.dynasty,
      mergedFrom: t.mergedFrom
    })), null, 2));

    if (moved) {
      addRandomTile(newTiles);
      setTiles([...newTiles]);
    }
  }, [tiles, setTiles, setScore]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 50) {
        moveTiles(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > 50) {
        moveTiles(deltaY > 0 ? 'down' : 'up');
      }
    }
    
    setTouchStart(null);
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    try {
      console.log('Key pressed:', event.key);
      if (event.key.startsWith('Arrow')) {
        event.preventDefault();
        const direction = event.key.replace('Arrow', '').toLowerCase() as 'up' | 'down' | 'left' | 'right';
        console.log('Moving tiles:', direction);
        moveTiles(direction);
      }
    } catch (error) {
      console.error('Error handling key down:', error);
    }
  }, [moveTiles]);

  const keyHandlerRef = useRef(handleKeyDown);
  useEffect(() => {
    keyHandlerRef.current = handleKeyDown;
  }, [handleKeyDown]);

  useEffect(() => {
    initializeBoard();
    const handler = (event: KeyboardEvent) => keyHandlerRef.current(event);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: '#f2ecde' }} /* 草白玉 - A gentle, traditional Chinese color from zhongguose.com */
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mb-4 text-2xl font-bold">分数: {score}</div>
      <div className="mb-4 text-sm text-gray-600">
        调试信息: 方块数量: {tiles.length}, 
        方块值: {tiles.map(t => t.value).join(', ')}
      </div>
      <div className="relative grid grid-cols-4 gap-4 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#E0C8A8', width: '26rem', height: '26rem' }} /* 素采 */>
        {/* Empty grid cells */}
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          return (
            <div
              key={`cell-${row}-${col}`}
              className="bg-gray-200 rounded-lg"
            />
          );
        })}
        {/* Animated tiles */}
        {tiles.map((tile) => {
          const dynasty = getDynastyForValue(tile.value);
          const tileSize = 96; // Keep tile size the same
          const gap = 16; // 1rem = 16px
          const x = tile.position[1] * (tileSize + gap);
          const y = tile.position[0] * (tileSize + gap);

          return (
            <div
              key={tile.id}
              className={`absolute flex items-center justify-center rounded-lg text-2xl font-bold
                transform transition-all duration-300 ease-in-out
                ${tile.isNew ? 'animate-pop' : ''}
                ${tile.mergedFrom ? 'animate-merge' : ''}`}
              style={{
                backgroundColor: dynasty ? dynasty.color : '#ccc',
                color: 'white',
                width: tileSize,
                height: tileSize,
                transform: `translate(${x}px, ${y}px)`,
                zIndex: 10
              }}
            >
              {dynasty ? dynasty.dynasty : ''}
            </div>
          );
        })}
      </div>
      <button
        onClick={initializeBoard}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        新游戏
      </button>
    </div>
  );
};

export default GameBoard;
