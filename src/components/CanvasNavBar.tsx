"use client";

import Image from "next/image";
import { memo } from "react";
import { NavbarProps } from "../../types/type";
import ActiveUsers from "./user/ActiveUsers";
import { navElements } from "../../constants";
import ShapesMenu from "./ShapesMenu";
import { NewThread } from "./comments/NewThread";
import { Button } from "./ui/button";

const Navbar = ({
  canvasForImage,
  shapeRef,
  syncShapeInStorage,
  canvasRef,
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
}) => {
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="flex select-none items-center justify-between gap-4 bg-canvas-black px-5 text-white">
      <span className="text-white font-bold">Design</span>

      <ul className="flex flex-row">
        {navElements.map((item: ActiveElement | any) => (
          <li
            key={item.name}
            onClick={() => {
              if (Array.isArray(item.value)) return;
              handleActiveElement(item);
            }}
            className={`group px-2.5 py-5 flex justify-center items-center
            ${
              isActive(item.value)
                ? "bg-canvas-green"
                : "hover:bg-canvas-grey-200"
            }
            `}
          >
            {/* If value is an array means it's a nav element with sub options i.e., dropdown */}
            {Array.isArray(item.value) ? (
              <ShapesMenu
                canvasForImage={canvasForImage}
                shapeRef={canvasRef}
                syncShapeInStorage={syncShapeInStorage}
                canvasRef={canvasRef}
                item={item}
                activeElement={activeElement}
                imageInputRef={imageInputRef}
                handleActiveElement={handleActiveElement}
                handleImageUpload={handleImageUpload}
              />
            ) : item?.value === "comments" ? (
              // If value is comments, trigger the NewThread component
              <NewThread>
                <Button className="relative w-5 h-5 object-contain">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    className={isActive(item.value) ? "invert" : ""}
                  />
                </Button>
              </NewThread>
            ) : (
              <Button
                variant="canvas"
                className="relative w-5 h-5 object-contain"
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  fill
                  className={
                    isActive(item.value)
                      ? "bg-canvas-green text-canvas-black"
                      : "bg-canvas-grey text-canvas-green"
                  }
                />
              </Button>
            )}
          </li>
        ))}
      </ul>

      <ActiveUsers />
    </nav>
  );
};

export default memo(
  Navbar,
  (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement
);
