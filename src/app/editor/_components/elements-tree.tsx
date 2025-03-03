'use client'

import CardLayout from "@/components/card-layout";
import { useEditorStore } from "@/app/editor/store";
import { useMemo } from "react";

export default function ElementsTree() {
  const storeVerses = useEditorStore((state) => state.verses)

  const verses = useMemo(() => {
    if(!storeVerses.to || !storeVerses.from) return;

    const to = Number(storeVerses.to)
    const from = Number(storeVerses.from)
    const arr = Array.from({ length: to - from + 1 }, (_, i) => from + i);

    return arr;
  }, [storeVerses])

  return (
    <CardLayout title="Elements Tree" parentClassName="h-full">
      <div className="flex flex-col gap-2">
        {verses?.map((verse, index) => (
          <div key={index} className="hover:bg-blue-500">
            {verse}
          </div>
        ))}
      </div>
    </CardLayout>
  )
}