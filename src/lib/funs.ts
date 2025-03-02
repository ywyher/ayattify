export const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Initial items generation moved outside component to avoid recreation on re-renders
export const generateInitialItems = () => Array.from({ length: 5 }, (_, i) => ({
  id: `draggable-${i + 1}`,
  position: { 
    x: getRandomNumber(50, 500),
    y: getRandomNumber(50, 500),
  },
  size: { 
    width: `${getRandomNumber(50, 200)}px`,
    height: `${getRandomNumber(50, 200)}px`,
  },
  rotation: getRandomNumber(0, 360),
  content: `Item ${i + 1}`,
  // content: `ﱂ`,
}));


export const renderChapterNames = (id: number) =>{ 
  if(id < 10) {
    return id
  }
  if(id < 100 && id >= 10) {
    return `0${id}`
  }
  if(id >= 100) {
    return id
  }
  return;
}