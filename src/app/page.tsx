'use client'

import React, { useEffect, useState, useRef } from 'react';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import Draggable from '@/components/draggable';
import { createSnapModifier, restrictToParentElement } from '@dnd-kit/modifiers';
import Selecto from 'react-selecto';

export type Item = {
  id: string,
  position: {
    x: number,
    y: number,
  },
  size: {
    width: string | number,
    height: string | number,
  },
  rotation: number, // Add rotation property
  content: string 
}

export type Selected = {
  id: Item['id']
}

export type Hover = {
  id: Item['id']
}

export default function DraggableDemo() {
  const [items, setItems] = useState<Item[]>([
   {
      id: "draggable-1",
      position: { x: 0, y: 0 },
      size: { width: 'auto', height: 'auto' },
      rotation: 0, // Initialize rotation to 0
      content: 'test',
    },
   {
      id: `draggable-2`,
      position: { x: 50, y: 50 },
      size: { width: 'auto', height: 'auto' },
      rotation: 0,
      content: 'test',
    },
   {
      id: `draggable-3`,
      position: { x: 100, y: 100 },
      size: { width: 'auto', height: 'auto' },
      rotation: 0,
      content: 'test',
    },
   {
      id: `draggable-4`,
      position: { x: 150, y: 150 },
      size: { width: 'auto', height: 'auto' },
      rotation: 0,
      content: 'test',
    },
  ]);

  const [selected, setSelected] = useState<Selected[]>([]);
  const [hover, setHover] = useState<Hover | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(items)
  }, [items])

  const gridSize = 20; // pixels
  const snapToGridModifier = createSnapModifier(gridSize);

  // Add click outside event listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If we clicked inside a draggable component, the event will be handled there
      // This is for clicking outside of any draggable component
      const clickedDraggable = (event.target as Element).closest('[data-draggable="true"]');
      
      if (!clickedDraggable) {
        // Clear selection when clicking outside
        setSelected([]);
      }
    }

    // Add the event listener to the document
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    
    setItems(prev => prev.map(item => {
      if (item.id === active.id) {
        return {
          ...item,
          position: {
            x: item.position.x + delta.x,
            y: item.position.y + delta.y
          }
        };
      }
      return item;
    }));
  };
  
  // Add a function to handle resize
  const handleResize = (id: Item['id'], size: Item['size']) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          size
        };
      }
      return item;
    }));
  };

  // Add a function to handle content change
  const handleContentChange = (id: Item['id'], content: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          content
        };
      }
      return item;
    }));
  };

  // Add a function to handle rotation
  const handleRotate = (id: Item['id'], angle: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          rotation: angle
        };
      }
      return item;
    }));
  };

  return (
    <>
      <div ref={containerRef} className='big relative w-full h-screen bg-black'>
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
          {items.map(item => (
            <Draggable
              className="cube"
              key={item.id} 
              id={item.id} 
              position={item.position}
              size={item.size}
              rotation={item.rotation}
              onResize={(size) => handleResize(item.id, size)}
              onRotate={(angle) => handleRotate(item.id, angle)}
              setSelected={setSelected}
              setHover={setHover}
              isSelected={selected.some(s => s.id === item.id)}
              isHover={hover ? hover.id === item.id : false}
              content={item.content}
              onContentChange={(content) => handleContentChange(item.id, content)}
              editable={true}
            />
          ))}
        </DndContext>
      </div>
    </>
  );
}