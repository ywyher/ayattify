import React from "react";

function Handler() {
  return (
    <div className="w-[12px] h-[12px] m-1 border-2 border-blue-500 bg-white rounded-full">
    </div>
  )
}

export default React.memo(Handler);