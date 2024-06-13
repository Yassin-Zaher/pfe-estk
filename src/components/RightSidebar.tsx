import { useMemo, useRef } from "react";
import Dimensions from "./settings/Dimensions";
import Text from "./settings/Text";
import Color from "./settings/Color";
import { modifyShape } from "../../lib/shapes";
import Export from "./settings/Export";

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({ ...prev, [property]: value }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };

  // memoize the content of the right sidebar to avoid re-rendering on every mouse actions
  const memoizedContent = useMemo(
    () => (
      <section className="hidden !bg-primary-black lg:flex flex-col border-t border-primary-grey-200  text-white min-w-[227px] sticky right-0 h-full max-lg:hidden select-none overflow-y-auto">
        <h3 className=" px-5 pt-4 text-xs uppercase">Design</h3>

        <Export fabricRef={fabricRef} />

        <Dimensions
          isEditingRef={isEditingRef}
          width={elementAttributes.width}
          height={elementAttributes.height}
          handleInputChange={handleInputChange}
        />

        <Text
          fontFamily={elementAttributes.fontFamily}
          fontSize={elementAttributes.fontSize}
          fontWeight={elementAttributes.fontWeight}
          handleInputChange={handleInputChange}
        />

        <Color
          inputRef={colorInputRef}
          attribute={elementAttributes.fill}
          placeholder="color"
          attributeType="fill"
          handleInputChange={handleInputChange}
        />

        <Color
          inputRef={strokeInputRef}
          attribute={elementAttributes.stroke}
          placeholder="stroke"
          attributeType="stroke"
          handleInputChange={handleInputChange}
        />
      </section>
    ),
    [elementAttributes]
  ); // only re-render when elementAttributes changes

  return memoizedContent;
};

export default RightSidebar;
