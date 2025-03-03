'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Editing, Hover, isDragging, Item, Selected } from "@/app/types";

const Draggable = dynamic(() => import("@/components/draggable"), { ssr: false });

type DraggableContainerProps = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  editable?: boolean;
};

export default function DraggableContainer({ 
  items, 
  setItems,
  editable = true 
}: DraggableContainerProps) {
  const [hover, setHover] = useState<Hover | undefined>();
  const [selected, setSelected] = useState<Selected | undefined>();
  const [isDragging, setIsDragging] = useState<isDragging | undefined>();
  const [editing, setEditing] = useState<Editing | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const leaderRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className="relative w-full h-full min-h-[300px]">
      {items.map(item => (
        // <p ref={leaderRef}>
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
            editable={editable}
          />
        // </p>
      ))}
    </div>
  );
}