// FlowPositioner.tsx
import { useEffect, useRef } from 'react';
import { Item } from "@/app/types";

type FlowPositionerProps = {
  items: Item[];
  onPositionsReady: (positions: {id: string, x: number, y: number}[]) => void;
};

export default function FlowPositioner({ items, onPositionsReady }: FlowPositionerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  
  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;
    
    // Get container's position for offset calculation
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate each item's position relative to the container
    const positions = items.map(item => {
      const element = itemsRef.current.get(item.id);
      if (!element) return { id: item.id, x: 0, y: 0 };
      
      const rect = element.getBoundingClientRect();
      return {
        id: item.id,
        // Calculate position relative to container
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top
      };
    });
    
    // Send positions back to parent
    onPositionsReady(positions);
  }, [items, onPositionsReady]);
  
  return (
    <div ref={containerRef} className="w-full" style={{ visibility: 'hidden', position: 'absolute' }}>
      {items.map(item => (
        <div 
          key={item.id}
          ref={el => {
            if (el) itemsRef.current.set(item.id, el);
            else itemsRef.current.delete(item.id);
          }}
          className="mb-4 p-2"
          style={{ fontFamily: item.font?.name || '' }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}