'use client'

const Draggable = dynamic(() => import("@/components/draggable"), { ssr: false });
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Editing, Hover, isDragging, Item, Selected } from "@/app/types";
import { generateInitialItems } from "@/lib/funs";

export default function Page() {
  const [items, setItems] = useState<Item[]>(() => generateInitialItems());
  const [hover, setHover] = useState<Hover | undefined>()
  const [selected, setSelected] = useState<Selected | undefined>()
  const [isDragging, setIsDragging] = useState<isDragging | undefined>()
  const [editing, setEditing] = useState<Editing | undefined>()
  const mainDiv = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const clickedDraggable = (event.target as Element).closest('[data-draggable="true"]');
    
    if (!clickedDraggable) {
      setSelected(undefined);
      setEditing(undefined);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
  
  return (
    <div ref={mainDiv}>
      {items.map(item => (
        <Draggable
          key={item.id}    
          item={item}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          setItems={setItems}
          setSelected={setSelected}
          setHover={setHover}
          isSelected={selected ? selected.id === item.id : false}
          isHover={hover ? hover.id === item.id : false}
          setEditing={setEditing}
          editing={editing}
          editable
        />
      ))}
    </div>
  )
}