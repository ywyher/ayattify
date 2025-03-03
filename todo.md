# should i make the text scale with the div ??

# add rotation functioanlity

# normal <p> tag and asign their values to the draggable ones !!!

<Selecto
dragContainer={".big"}
selectableTargets={[".big .draggable"]}
hitRate={100}
selectByClick={true}
selectFromInside={true}
ratio={0}
onSelect={e => {
// Create a new array to hold selected IDs
const newSelected: Selected[] = [...selected];

      // Add newly selected elements
      e.added.forEach(el => {
        // Find the ID from the element or its closest parent
        const draggableId = el.id || el.getAttribute('id');
        if (draggableId && !newSelected.some(item => item.id === draggableId)) {
          newSelected.push({ id: draggableId });
        }
      });

      // Remove deselected elements
      e.removed.forEach(el => {
        const draggableId = el.id || el.getAttribute('id');
        if (draggableId) {
          const index = newSelected.findIndex(item => item.id === draggableId);
          if (index !== -1) {
            newSelected.splice(index, 1);
          }
        }
      });

      console.log("Setting selected to:", newSelected);
      setSelected(newSelected);
    }}

/>
