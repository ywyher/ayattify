import React, { useCallback, useState } from "react";
import { render } from "react-dom";
import { Resizable } from "re-resizable";

const App = () => {
  const [size, setSize] = useState({
    left: 100,
    top: 100,
    width: 200,
    height: 200
  });
  const [dragStartSize, setDragStartSize] = useState();

  // reference link https://github.com/bokuweb/react-rnd/blob/42948d0c69111a49b0aef684bdabdbd966335e26/src/index.tsx#L497
  const onResize = useCallback(
    ({ delta, direction, size }) => {
      if (!dragStartSize) {
        return;
      }
      const directions = ["top", "left", "topLeft", "bottomLeft", "topRight"];

      if (directions.indexOf(direction) !== -1) {
        let newLeft = size.left;
        let newTop = size.top;

        if (direction === "bottomLeft") {
          newLeft = dragStartSize.left - delta.width;
        } else if (direction === "topRight") {
          newTop = dragStartSize.top - delta.height;
        } else {
          newLeft = dragStartSize.left - delta.width;
          newTop = dragStartSize.top - delta.height;
        }

        setSize({
          ...size,
          left: newLeft,
          top: newTop
        });
      }
    },
    [dragStartSize]
  );

  console.log("re-render");
  return (
    <>
      <a
        rel="noreferrer"
        target="_blank"
        href="https://github.com/bokuweb/re-resizable/issues/684#issuecomment-1696712117"
      >
        original issue link https://github.com/bokuweb/re-resizable/issues/684
      </a>
      <Resizable
        style={{
          position: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "solid 1px #ddd",
          background: "#f0f0f0",
          left: `${size.left}px`,
          top: `${size.top}px`,
          boxSizing: "border-box"
        }}
        lockAspectRatio={true}
        onResizeStart={() => {
          setDragStartSize(size);
        }}
        onResize={(event, direction, elementRef, delta) => {
          onResize({ delta, direction, size });
        }}
        onResizeStop={() => {
          setDragStartSize(undefined);
        }}
        defaultSize={size}
      >
        001
      </Resizable>
    </>
  );
};

render(<App />, document.getElementById("root"));