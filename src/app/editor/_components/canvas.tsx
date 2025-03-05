'use client'
import { useEditorStore } from "@/app/editor/store";
import { Card, CardContent } from "@/components/ui/card";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
// data
import data from '@/lib/data/qpc/v2/ayah-by-ayah.json'
import { Item } from "@/app/types";
import DynamicFont from "@/components/dynamic-font";
import DraggableContainer from "@/components/draggable-container";

type Ghost = {
  position: {
    x: number;
    y: number;
  };
  size: {
    width: string;
    height: string
  }
}

export default function Canvas() {
  const storeChapter = useEditorStore((state) => state.chapter);
  const storeVerses = useEditorStore((state) => state.verses);
  const [items, setItems] = useState<Item[]>([]);
  const [loadedFonts, setLoadedFonts] = useState<Item['font'][]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPositionLoaded, setIsPositionLoaded] = useState<boolean>(false);

  const fetchData = useCallback(() => {
    if (!storeChapter || !storeVerses.from || !storeVerses.to || !data) return;

    // Reset old data
    if(items.length) {
      setItems([])
      setIsPositionLoaded(false)
    }
    
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
    const itemsInRange: Item[] = versesArray.map((verse, index) => ({
      id: verse.verse_key.split(':')[1],
      content: verse.text,
      font: {
        name: `qpc-v2-p${verse.page_number}`,
        src: `/fonts/qpc/v2/p${verse.page_number}.woff2`,
        type: 'woff2'
      },
      position: { x: 0, y: 0 }, // Default position
      size: { width: "10px", height: "10px" }, // Default size
      rotation: 0
    }));
    
    setItems(itemsInRange);
    
    // Track needed fonts - get unique fonts using a Map
    // This ensures we only have one entry per unique font name
    const fontsMap = new Map<string, Item['font']>();
    
    itemsInRange.forEach(item => {
      if (!fontsMap.has(item.font?.name || "")) {
        fontsMap.set(item.font?.name || "", item.font);
      }
    });

    setLoadedFonts(Array.from(fontsMap.values()));
  }, [storeChapter, storeVerses, data]);

  useEffect(() => {
    if (!storeChapter || !storeVerses.from || !storeVerses.to || !data) return;
    fetchData();
  }, [storeChapter, storeVerses]);

  const updateItemPositions = useCallback(() => {
    if (!items.length || !containerRef?.current) return;
  
    const updatedItems = items.map((item, index) => {
      const child = containerRef.current?.children[index];
      if (!child) return item;

      const rect = child.getBoundingClientRect();

      console.log('###################################################');
      console.log(item.size.width);
      console.log(Math.round(rect.width));
      console.log('###################################################');
  
      return {
        ...item,
        position: {
          x: Math.round(rect.left),
          y: Math.round(rect.top),
        },
        size: {
          // + 5 make the verse number mark be inline with the verse !!
          width: `${Math.round(rect.width) + 5}px`,
          height: `${Math.round(rect.height) + 5}px`,
        }
      };
    });

    console.log(updatedItems)

    // Only update if positions have actually changed
    const hasChanges = updatedItems.some((updatedItem, index) => 
      updatedItem.position.x !== items[index].position.x ||
      updatedItem.position.y !== items[index].position.y ||
      updatedItem.size.width !== items[index].size.width ||
      updatedItem.size.height !== items[index].size.height
    );

    if (hasChanges) {
      setItems(updatedItems);
      setIsPositionLoaded(true)
    }
  }, [containerRef, items]);

  useEffect(() => {
    if (!items.length || !containerRef.current?.childElementCount) return;
    updateItemPositions();
  }, [items, containerRef]);

  return (
    <>
      <Card className="bg-[#E4D0B7] w-[550px] h-fit m-auto">
        <CardContent
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
          {/* These are basicaly a Ghost elements for us to take the postition/size from them and apply it to the draggable components */}
          {items.length && (
            <div ref={containerRef} className="flex flex-wrap">
              {items.map((item) => (
                <p
                  key={item.id}
                  className={`
                    w-fit h-fit
                  `}
                  style={{
                    fontFamily: item.font?.name
                  }}
                >
                  {item.content}
                </p>
              ))}
            </div>
          )}
          {(items.length && isPositionLoaded) ? (
            <DraggableContainer
              items={items}
              setItems={setItems}
              editable={false}
            />
          ) : 'Select verses to display'}
        </CardContent>
      </Card>
    </>
  )
}