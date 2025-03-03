'use client'

import { useState, useEffect, useCallback, useMemo } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Chapter, Verse } from "@/app/types";
// data
import chapters from "@/lib/data/surah.json";
import verses from '@/lib/data/simple.json'
import CardLayout from "@/components/card-layout";
import { useEditorStore } from "@/app/editor/store";

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

  const setChapter = useEditorStore((state) => state.setChapter)
  const setVerses = useEditorStore((state) => state.setVerses)

  const filteredVerses = useMemo(() => {
    return Object.values(verses).filter((verse) => {
      const chapterNumber = verse.verse_key.split(':')[0];
      
      if (chapterNumber !== chapterId.toString()) return false;
      
      if (fromVerseId !== undefined) {
        return verse.id >= parseInt(fromVerseId.toString());
      }
      
      return true;
    });
  }, [chapterId, fromVerseId]);

  const handleSelect = useCallback((verse: Verse) => {
    setSelected(verse);
    setOpen(false);
    onVerseSelect(verse);

    if(fromVerseId !== undefined) {
      setChapter({
        id: chapterId,
        name_simple: ''
      })
      setVerses({
        from: fromVerseId,
        to: verse.id
      })
    }
  }, [onVerseSelect]);

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
          {selected ? selected.verse_key.split(':')[1] : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search verses..." />
          <CommandList>
            {filteredVerses.map((verse) => {
              const verseNumber = verse.verse_key.split(':')[1]
              return (
                <CommandItem
                  key={verse.id}
                  value={`${verseNumber} ${verse.text}`}
                  onSelect={() => handleSelect(verse)}
                >
                  {verseNumber} - {verse.text}
                </CommandItem>
              )
            })}
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

  const handleChapterSelect = useCallback((chapter: Chapter) => {
    setSelected(chapter);
    setFromVerse(undefined);
    setToVerse(undefined);
    setOpen(false);
  }, []);

  return (
    <CardLayout title="Select Chapter - Verses" parentClassName="h-full" className="flex flex-col gap-5">
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
    </CardLayout>
  );
}