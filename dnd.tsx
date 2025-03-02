'use client'

import React, { useEffect, useState, useRef } from 'react';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { createSnapModifier, restrictToParentElement } from '@dnd-kit/modifiers';

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

import { Dispatch, SetStateAction } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Resizable } from 're-resizable';
import { Input } from '@/components/ui/input';

export function Draggable({ 
  id, 
  position,
  size,
  rotation,
  onResize,
  onRotate,
  setSelected,
  setHover,
  isSelected,
  isHover,
  editable,
  content,
  onContentChange,
  className
}: { 
  id: string, 
  position: { x: number, y: number },
  size: Item['size'],
  rotation: number,
  onResize: (size: Item['size']) => void,
  onRotate: (angle: number) => void,
  setSelected: Dispatch<SetStateAction<Selected[]>>,
  setHover: Dispatch<SetStateAction<Hover | null>>,
  isSelected?: boolean,
  isHover?: boolean,
  editable?: boolean,
  content?: string,
  onContentChange?: (content: string) => void,
  className?: string
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content || '');
  const [isDraggingRotator, setIsDraggingRotator] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);
  
  // Update local state when content prop changes
  useEffect(() => {
    if (content !== undefined) {
      setEditableContent(content);
    }
  }, [content]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const style = {
    transform: transform 
      ? `translate3d(${transform.x + position.x}px, ${transform.y + position.y}px, 0) rotate(${rotation}deg)` 
      : `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg)`,
    boxShadow: isDragging ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
    transition: isDragging ? 'box-shadow 0.2s ease-in-out' : 'none',
    position: 'absolute' as const,
    zIndex: isDragging ? 999 : isSelected ? 100 : 1,
    border: (isSelected || isHover) ? '2px solid blue' : '2px solid transparent',
    transformOrigin: 'center center',
  };
  
  // Handle resize stop
  const handleResizeStop = (e: MouseEvent | TouchEvent, direction: string, ref: HTMLElement, delta: { width: number, height: number }) => {
    onResize({
      width: ref.style.width,
      height: ref.style.height
    });
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(prev => [{ id }]);
  };
  
  // Handle double click to enter edit mode
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (editable) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableContent(e.target.value);
  };
  
  // Handle finishing editing
  const finishEditing = () => {
    setIsEditing(false);
    if (onContentChange) {
      onContentChange(editableContent);
    }
  };

  // Handle key press events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEditing();
    }
    
    // Prevent drag listener events when editing
    e.stopPropagation();
  };

  // Improved rotation handler with better event handling
  const handleRotatorMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!componentRef.current) return;
    
    setIsDraggingRotator(true);
    
    // Calculate center point once at the start of the drag operation
    const rect = componentRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRotator && !componentRef.current) return;
      
      // Calculate angle from center to cursor
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      
      // Add 90 degrees to align the rotator correctly
      onRotate(angle + 90);
    };
    
    const onMouseUp = () => {
      setIsDraggingRotator(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    // Add mouse event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  // Clean up any remaining event listeners on unmount
  useEffect(() => {
    return () => {
      // This is a safety cleanup in case the component unmounts while rotating
      const cleanupMouseEvents = () => {
        document.removeEventListener('mousemove', cleanupMouseEvents);
        document.removeEventListener('mouseup', cleanupMouseEvents);
      };
      
      if (isDraggingRotator) {
        cleanupMouseEvents();
      }
    };
  }, []);
  
  return (
    <div 
      ref={(node) => {
        setNodeRef(node); 
        if (componentRef) componentRef.current = node;
      }}
      style={style} 
      id={id}
      className={`draggable ${className || ''}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => {
        setHover({ id });
      }}
      onMouseLeave={() => {
        setHover(null);
      }}
      onDoubleClick={handleDoubleClick}
      data-draggable="true"
      {...attributes}
    >
      {/* Rotation handle (visible only when selected) */}
      {isSelected && (
        <div 
          className="absolute"
          style={{
            width: '1px',
            height: '20px',
            background: 'blue',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 101
          }}
        >
          <div 
            ref={rotatorRef}
            className="absolute cursor-move bg-white border-2 border-blue-500 rounded-full"
            style={{
              width: '12px',
              height: '12px',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
              zIndex: 102
            }}
            onMouseDown={handleRotatorMouseDown}
          />
        </div>
      )}

      <Resizable
        size={{ width: size.width, height: size.height }}
        onResizeStop={handleResizeStop}
        minWidth={100}
        style={{
          background: 'red'
        }}
        enable={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true
        }}
        handleStyles={{
          topRight: { cursor: 'ne-resize' },
          bottomRight: { cursor: 'se-resize' },
          bottomLeft: { cursor: 'sw-resize' },
          topLeft: { cursor: 'nw-resize' }
        }}
        handleComponent={{
          bottomRight: (isSelected) ? <Handler /> : undefined,
          bottomLeft: (isSelected) ? <Handler /> : undefined,
          topRight: (isSelected) ? <Handler /> : undefined,
          topLeft: (isSelected) ? <Handler /> : undefined,
        }}
      >
        <div
          className="w-full h-full flex flex-1 items-center justify-center"
          style={{
            touchAction: 'none',
            msTouchAction: 'none',
            userSelect: 'none',
            overflow: 'hidden',
            background: 'violet'
          }}
        >
          {isEditing ? (
            <Input
              ref={inputRef}
              type="text"
              value={editableContent}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onBlur={finishEditing}
              className="w-fit text-center bg-transparent outline-none rounded px-2 py-1"
              style={{ cursor: 'text' }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div 
              {...listeners}
              className="flex-1 flex items-center justify-center w-full h-full"
              style={{ cursor: 'grab' }}
            >
              {editableContent}
            </div>
          )}
        </div>
      </Resizable>
    </div>
  );
}

function Handler() {
  return (
    <div className="w-[12px] h-[12px] m-1 border-2 border-blue-500 bg-white rounded-full">
    </div>
  )
}

React.memo(Handler);