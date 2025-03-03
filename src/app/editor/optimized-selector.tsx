'use client'

import { useState, useEffect, useCallback, useMemo } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Chapter, Verse } from "@/app/types";
// data
import chapters from "@/lib/data/surah.json";
import verses from '@/lib/data/uthmani.json'

function VerseSelector({
  chapterId,
  fromVerseId,
  placeholder,
  disabled = false,
  onVerseSelect
}: {
  chapterId: Chapter['id'],
  fromVerseId?: Verse['id'],
  placeholder: string,
  disabled?: boolean,
  onVerseSelect: (verse: Verse | undefined) => void
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Verse>();

  // Memoize filtered verses to avoid recalculation on each render
  const filteredVerses = useMemo(() => {
    return Object.values(verses).filter((verse) => {
      const chapterNumber = verse.verse_key.split(':')[0];
      
      // Filter by chapter
      if (chapterNumber !== chapterId.toString()) return false;
      
      // Additional filtering for "to" verse selector
      if (fromVerseId !== undefined) {
        return verse.id >= parseInt(fromVerseId.toString());
      }
      
      return true;
    });
  }, [chapterId, fromVerseId]);

  // Handle selection with useCallback to prevent recreating on each render
  const handleSelect = useCallback((verse: Verse) => {
    setSelected(verse);
    setOpen(false);
    onVerseSelect(verse);
  }, [onVerseSelect]);

  // Reset selection when dependencies change
  useEffect(() => {
    setSelected(undefined);
    onVerseSelect(undefined);
  }, [chapterId, fromVerseId, onVerseSelect]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-64 cursor-pointer"
          disabled={disabled}
        >
          {selected ? selected.text : placeholder}
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
                onSelect={() => handleSelect(verse)}
              >
                {verse.verse_key.split(':')[1]} - {verse.text}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function ChapterSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Chapter>();
  const [fromVerse, setFromVerse] = useState<Verse>();
  const [toVerse, setToVerse] = useState<Verse>();

  // Handle chapter selection with useCallback
  const handleChapterSelect = useCallback((chapter: Chapter) => {
    setSelected(chapter);
    setFromVerse(undefined);
    setToVerse(undefined);
    setOpen(false);
  }, []);

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
                  onSelect={() => handleChapterSelect(chapter)}
                >
                  {chapter.name_simple}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selected && (
        <VerseSelector
          chapterId={selected.id}
          placeholder="Select starting verse"
          onVerseSelect={setFromVerse}
        />
      )}
      
      {selected && fromVerse && (
        <VerseSelector
          chapterId={selected.id}
          fromVerseId={fromVerse.id}
          placeholder="Select ending verse"
          disabled={!fromVerse}
          onVerseSelect={setToVerse}
        />
      )}
    </div>
  );
}