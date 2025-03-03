'use client'
import { useEditorStore } from "@/app/editor/store";
import { Card, CardContent } from "@/components/ui/card";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
// data
import data from '@/lib/data/qpc/v2/ayah-by-ayah.json'
import { Item } from "@/app/types";
import DynamicFont from "@/components/dynamic-font";
import DraggableContainer from "@/components/draggable-container";
import FlowPositioner from "@/components/flow-positioner";

export default function Canvas() {
  const storeChapter = useEditorStore((state) => state.chapter);
  const storeVerses = useEditorStore((state) => state.verses);
  const [items, setItems] = useState<Item[]>([]);
  const [loadedFonts, setLoadedFonts] = useState<Item['font'][]>([]);

  const fetchData = useCallback(() => {
    if (!storeChapter || !storeVerses.from || !storeVerses.to || !data) return;
    
    const fromId = Number(storeVerses.from);
    const toId = Number(storeVerses.to);
    
    // Filter verses by ID range
    const versesArray = Object.values(data).filter(verse =>
      verse.id >= fromId && verse.id <= toId
    );

    const containerWidth = 550; // Match your Card width or use a ref to get actual width
    const containerPadding = 16; // CardContent padding
    const itemWidth = 160; // Approximate width for each item
    const itemHeight = 80; // Approximate height for each item
    const itemsPerRow = Math.floor((containerWidth - 2 * containerPadding) / itemWidth);
    
    // Convert verses to draggable items
    const items: Item[] = versesArray.map((verse, index) => ({
      id: uuidv4(),
      content: verse.text,
      font: {
        name: `qpc-v2-p${verse.page_number}`,
        src: `/fonts/qpc/v2/p${verse.page_number}.woff2`,
        type: 'woff2'
      },
      position: {
        x: containerPadding + (index % itemsPerRow) * itemWidth,
        y: containerPadding + Math.floor(index / itemsPerRow) * itemHeight
      },
      size: {
        width: `auto`, // Slight margin between items
        height: "auto"
      },
      rotation: 0
    }));
    
    setItems(items);
    
      // Track needed fonts - get unique fonts using a Map
    // This ensures we only have one entry per unique font name
    const fontsMap = new Map<string, Item['font']>();
    
    items.forEach(item => {
      if (!fontsMap.has(item.font?.name || "")) {
        fontsMap.set(item.font?.name || "", item.font);
      }
    });

    setLoadedFonts(Array.from(fontsMap.values()));
  }, [storeChapter, storeVerses, data]);

  useEffect(() => {
    if (!storeChapter || !storeVerses.from || !storeVerses.to || !data) return;
    fetchData();
  }, [storeChapter, storeVerses, fetchData]);

  // In Canvas.tsx
const [initialPositioning, setInitialPositioning] = useState(false);

// Handle positions from the flow layout
const handlePositionsReady = useCallback((positions: {id: string, x: number, y: number}[]) => {
  if (initialPositioning) return; // Only do this once initially
  
  setItems(prev => prev.map(item => {
    const position = positions.find(p => p.id === item.id);
    if (!position) return item;
    
    return {
      ...item,
      position: {
        x: position.x,
        y: position.y
      }
    };
  }));
  
  setInitialPositioning(true);
}, [initialPositioning]);

  return (
    <Card className="bg-[#E4D0B7] mx-10 w-[550px] h-fit m-auto">
      <CardContent>
        <div 
          className="text-2xl"
          dir={`${items.length ? "rtl" : 'ltr'}`}
        >
          {loadedFonts.map(font => (
            <DynamicFont 
              key={`${font?.name || ""}`}  
              name={font?.name || ""} 
              path={font?.src || ""}
              type={font?.type || ""}
            />
          ))}
          

            {/* Hidden flow positioner */}
        <FlowPositioner items={items} onPositionsReady={handlePositionsReady} />
        
          
        {/* Draggable container with positioned items */}
        {items.length > 0 && initialPositioning && (
          <DraggableContainer 
            items={items}
            setItems={setItems}
            editable={true}
          />
        )}
        
        {/* Placeholder while positioning */}
        {items.length > 0 && !initialPositioning && (
          <div className="text-center p-4">Arranging items...</div>
        )}
        
        {items.length === 0 && 'Select verses to display'}
        </div>
      </CardContent>
    </Card>
  )
}