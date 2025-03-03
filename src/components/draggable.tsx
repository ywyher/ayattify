'use client'

import { Editing, Hover, isDragging, Item, Selected } from "@/app/types";
import Handler from "@/components/handler";
import { Input } from "@/components/ui/input";
import React, { Dispatch, MouseEvent, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { Rnd } from "react-rnd";

type Draggable = {
  item: Item,
  isDragging: isDragging | undefined
  setIsDragging: Dispatch<SetStateAction<isDragging | undefined>>
  setSelected: Dispatch<SetStateAction<Selected | undefined>>
  setHover: Dispatch<SetStateAction<Hover | undefined>>
  setItems: Dispatch<SetStateAction<Item[]>>
  isSelected: boolean
  isHover: boolean
  setEditing: Dispatch<SetStateAction<Editing | undefined>>
  editing: Editing | undefined
  editable?: boolean
}

function Draggable({
  item,
  isDragging,
  setSelected,
  setHover,
  setIsDragging,
  setItems,
  isHover,
  isSelected,
  setEditing,
  editing,
  editable = false
}: Draggable) {

  const style = useMemo(() => ({
    boxShadow: item.id === isDragging?.id ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
    transition: item.id === isDragging?.id ? 'box-shadow 0.2s ease-in-out' : 'none',
    position: 'absolute' as const,
    zIndex: isDragging?.id === item.id ? 999 : isSelected ? 100 : 1,
    border: (isSelected || isHover) ? '2px solid blue' : '2px solid transparent',
    transformOrigin: 'center center',
    fontFamily: (item.font && item.font.name) ? `${item.font.name}` : ''
  }), [item.id, isDragging?.id, isSelected, isHover]);

  const [editableContent, setEditableContent] = useState<string>(item.content)

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableContent(e.currentTarget.value);
  }, []);
  
  const finishEditing = useCallback(() => {
    if (!editing && editableContent !== item.content) {
      setItems(prev => prev.map(prevItem => 
        prevItem.id === item.id 
          ? { ...prevItem, content: editableContent }
          : prevItem
      ));
    }
  }, [editing, editableContent, item.id, item.content, setItems]);
  
  useEffect(() => {
    finishEditing();
  }, [editing, finishEditing]);

  const handleMouseDown = useCallback(() => {
    setSelected({ id: item.id });
  }, [item.id, setSelected]);

  const handleMouseEnter = useCallback(() => {
    setHover({ id: item.id });
  }, [item.id, setHover]);

  const handleMouseLeave = useCallback(() => {
    setHover(undefined);
  }, [setHover]);

  const handleDragStart = useCallback(() => {
    setIsDragging({ id: item.id });
  }, [item.id, setIsDragging]);

  const handleDragStop = useCallback((e: any, d: any) => {
    const { x, y, node } = d;
    
    const xDiff = Math.abs(item.position.x - x);
    const yDiff = Math.abs(item.position.y - y);
    
    if (xDiff < 3 && yDiff < 3) return;

    setItems(prev => prev.map(prevItem => 
      prevItem.id === node.id 
        ? { ...prevItem, position: { x, y } }
        : prevItem
    ));

    setIsDragging(undefined);
  }, [item.position.x, item.position.y, setItems, setIsDragging]);

  const handleResizeStop = useCallback((e: any, direction: any, ref: any, delta: any, position: any) => {
    const width = parseInt(item.size.width, 10);
    const height = parseInt(item.size.height, 10);

    const xDiff = Math.abs(width - ref.offsetWidth);
    const yDiff = Math.abs(height - ref.offsetHeight);
    
    if (xDiff < 3 && yDiff < 3) return;

    setItems(prev => prev.map(prevItem => 
      prevItem.id === ref.id 
        ? {
            ...prevItem,
            position,
            size: {
              width: `${ref.offsetWidth}px`,
              height: `${ref.offsetHeight}px`,
            }
          }
        : prevItem
    ));
  }, [item.size.width, item.size.height, setItems]);

  const handleDoubleClick = useCallback((e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (editable) {
      setEditing({ id: item.id });
      e.stopPropagation();
    }
  }, [editable, item.id, setEditing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }, []);

  const handleBlur = useCallback(() => {
    setEditing(undefined);
  }, [setEditing]);

  const resizeHandles = useMemo(() => ({
    topLeft: isSelected ? <Handler /> : undefined,
    topRight: isSelected ? <Handler /> : undefined,
    bottomLeft: isSelected ? <Handler /> : undefined,
    bottomRight: isSelected ? <Handler /> : undefined,
  }), [isSelected]);

  return (
    <Rnd
      key={item.id}
      id={item.id}
      default={{
        x: item.position.x,
        y: item.position.y,
        width: item.size.width,
        height: item.size.height,
      }}
      style={{...style}}
      minHeight={50}
      minWidth={50}
      data-draggable={true}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      resizeHandleComponent={resizeHandles}
      onDoubleClick={handleDoubleClick}
    >
      {editing?.id == item.id ? (
        <Input
          value={editableContent}
          onChange={handleContentChange}
          onBlur={handleBlur}
          autoFocus
          className="border-0 outline-0"
          onKeyDown={handleKeyDown}
        />
      ): (
        <>
          {editableContent}
        </>
      )}
    </Rnd>
  )
}

export default React.memo(Draggable)