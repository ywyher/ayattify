'use client'

import { useState, useEffect } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Chapter, Verse } from "@/app/types";

// data
import chapters from "@/lib/data/surah.json";
import verses from '@/lib/data/uthmani.json'

function VersesTo({ 
  chapterId, 
  fromVerseId 
}: { 
  chapterId: Chapter['id'], 
  fromVerseId: Verse['id'] | undefined 
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Verse>();

  // Filter verses that belong to the selected chapter and come after the selected "from" verse
  const filteredVerses: Verse[] = Object.values(verses).filter((verse) => {
    const chapterNumber = verse.verse_key.split(':')[0];
    // First, ensure verse is from selected chapter
    if (chapterNumber !== chapterId.toString()) return false;
    
    // Then, ensure it comes after or equals the "from" verse
    if (!fromVerseId) return false;
    return verse.id >= parseInt(fromVerseId.toString());
  });

  // Clear selection when fromVerseId changes
  useEffect(() => {
    setSelected(undefined);
  }, [fromVerseId]);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-64 cursor-pointer"
            disabled={!fromVerseId}
          >
            {selected ? selected.text : "Select ending verse"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search verses..." />
            <CommandList>
              {filteredVerses.map((verse) => (
                <CommandItem
                  key={verse.id}
                  value={verse.text}
                  onSelect={() => {
                    setSelected(verse);
                    setOpen(false);
                  }}
                >
                  {verse.verse_key.split(':')[1]} - {verse.text}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function VersesFrom({ 
  chapterId, 
  onVerseSelect 
}: { 
  chapterId: Chapter['id'],
  onVerseSelect: (verse: Verse | undefined) => void
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Verse>();

  // Filter verses that belong to the selected chapter
  const filteredVerses: Verse[] = Object.values(verses).filter((verse) => {
    const chapterNumber = verse.verse_key.split(':')[0];
    return chapterNumber === chapterId.toString();
  });

  // Notify parent component when selection changes
  useEffect(() => {
    onVerseSelect(selected);
  }, [selected, onVerseSelect]);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-64 cursor-pointer">
            {selected ? selected.text : "Select starting verse"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search verses..." />
            <CommandList>
              {filteredVerses.map((verse) => (
                <CommandItem
                  key={verse.id}
                  value={verse.text}
                  onSelect={() => {
                    setSelected(verse);
                    setOpen(false);
                  }}
                >
                  {verse.verse_key.split(':')[1]} - {verse.text}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function ChapterSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Chapter>();
  const [fromVerse, setFromVerse] = useState<Verse>();

  return (
    <div className="flex flex-col gap-5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-64 cursor-pointer">
            {selected ? selected.name_simple : "Select a chapter"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search chapters..." />
            <CommandList>
              {Object.values(chapters).map((chapter) => (
                <CommandItem
                  key={chapter.id}
                  value={chapter.name_simple}
                  onSelect={() => {
                    setSelected(chapter);
                    setFromVerse(undefined);
                    setOpen(false);
                  }}
                >
                  {chapter.name_simple}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selected && (
        <VersesFrom 
          chapterId={selected.id} 
          onVerseSelect={(verse) => setFromVerse(verse)}
        />
      )}
      
      {selected && fromVerse && (
        <VersesTo 
          chapterId={selected.id} 
          fromVerseId={fromVerse.id}
        />
      )}
    </div>
  );
}