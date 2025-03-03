import Canvas from "@/app/editor/_components/canvas";
import Customizations from "@/app/editor/_components/customizations";
import ElementsTree from "@/app/editor/_components/elements-tree";
import Selector from "@/app/editor/_components/selector";
import { Separator } from "@/components/ui/separator";
import data from '@/lib/data/qpc/v2/ayah-by-ayah.json'

export default function Editor() {
  return (
    <div className="grid grid-cols-5 gap-10 h-screen bg-gray-200">
      <div className="grid grid-rows-3 gap-2 col-span-1">
        <div className="row-span-1">
          <Selector />
        </div>
        <div className="row-span-2">
          <ElementsTree />
        </div>
      </div>
      <div className="col-span-3 mt-20">
        <Canvas />
      </div>
      <div className="col-span-1">
        <Customizations />
      </div>
    </div>
  )
}