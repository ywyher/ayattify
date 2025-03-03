import { Chapter } from "@/app/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type StoreChapter = Partial<Pick<Chapter, 'id' | 'name_simple'>>
type Verses = {
  from: string | number,
  to: string | number
}

type editor = {
  chapter: StoreChapter
  setChapter: (chapter: StoreChapter) => void;
  verses: Partial<Verses>;
  setVerses: (verses: Verses) => void;
  reset: () => void;
};

export const useEditorStore = create<editor>((set) => ({
  chapter: { id: 1, name_simple: undefined },
  setChapter: (chapter) => set({ chapter }),
  verses: { from: 1, to: 7 },
  setVerses: (verses) => set({ verses }),
  
  reset: () => {
    set({
      chapter: {
        id: undefined,
        name_simple: undefined
      },
      verses: {
        from: undefined,
        to: undefined
      }
    });
  },
}));