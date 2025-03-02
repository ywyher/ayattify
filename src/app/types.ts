export type Item = {
  id: string,
  position: {
    x: number,
    y: number,
  },
  size: {
    width: string,
    height: string,
  },
  rotation: number
  content: string 
}

export type Selected = {
  id: Item['id']
}

export type Hover = {
  id: Item['id']
}

export type Editing = {
  id: Item['id']
}

export type isDragging = {
  id: Item['id']
}

export type Chapter = {
  id: string | number,
  name: string | number,
  name_simple: string,
  revelation_order: string | number,
  revelation_place: string,
  verses_count: string | number,
  pages_range: string
}

export type Verse = {
  id: string | number
  verse_key: string
  text: string
}