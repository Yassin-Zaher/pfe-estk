"use client";

import Image from "next/image";
import { fabric } from "fabric";
import { ShapesMenuProps } from "../../types/type";
import { v4 as uuidv4 } from "uuid";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useMutation } from "../../liveblocks.config";
import { imgUrls } from "@/lib/utils";

const ShapesMenu = ({
  canvasForImage,
  shapeRef,
  syncShapeInStorage,
  canvasRef,
  item,
  activeElement,
  handleActiveElement,
  handleImageUpload,
  imageInputRef,
}: ShapesMenuProps) => {
  const isDropdownElem = item.value.some(
    (elem) => elem?.value === activeElement.value
  );

  const deleteImageFromStorage = useMutation(({ storage }, shapeId) => {
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(shapeId);
  }, []);

  const handleArticle = (elem) => {
    const imageObject = canvasForImage.current._objects.find((o) =>
      imgUrls.includes(o.src)
    );
    if (imageObject) {
      deleteImageFromStorage(imageObject.objectId);
    }

    fabric.Image.fromURL(elem.icon, (img) => {
      img.scaleToWidth(400);
      img.scaleToHeight(400);
      img.selectable = false;
      img.evented = false;

      img.set({ left: 0, top: 0 });

      img.sendToBack();
      canvasForImage.current.add(img);
      canvasForImage.current.centerObject(img);
      // @ts-ignore
      img.objectId = uuidv4();
      syncShapeInStorage(img);
      canvasForImage.current.requestRenderAll();
    });

    localStorage.setItem("imageLoaded", "true");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="no-ring">
          <Button
            className="relative h-5 w-5 object-contain bg-inherit"
            onClick={() => handleActiveElement(item)}
          >
            <Image
              src={isDropdownElem ? activeElement.icon : item.icon}
              alt={item.name}
              fill
              className={isDropdownElem ? "invert" : ""}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-5 flex flex-col gap-y-1 border-none bg-canvas-black py-4 text-white">
          {item.value.map((elem) => (
            <Button
              variant="canvas"
              key={elem?.name}
              onClick={() => {
                if (elem.value.includes("article")) {
                  handleArticle(elem);
                } else {
                  handleActiveElement(elem);
                }
              }}
              className={`flex h-fit justify-between gap-10 rounded-none px-5 py-3 focus:border-none ${
                activeElement.value === elem?.value
                  ? "bg-canvas-green"
                  : "hover:bg-canvas-grey-200"
              }`}
            >
              <div className="group flex items-center gap-2">
                <Image
                  src={elem?.icon as string}
                  alt={elem?.name as string}
                  width={20}
                  height={20}
                  className={
                    activeElement.value === elem?.value ? "invert" : ""
                  }
                />
                <p
                  className={`text-sm  ${
                    activeElement.value === elem?.value
                      ? "text-canvas-black"
                      : "text-white"
                  }`}
                >
                  {elem?.name}
                </p>
              </div>
            </Button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
};

export default ShapesMenu;
