import { cn } from "@/lib/utils";
import { HTMLAttributes, useEffect, useState } from "react";

const Tshirt = ({ imgSrc, model, className, ...props }) => {
  const [modelImg, setModelImg] = useState("/over-tshirt-image.png");

  useEffect(() => {
    switch (model) {
      case "tshirt":
        setModelImg("/over-tshirt-image.png");
        break;
      case "custom":
        setModelImg(imgSrc);
    }
  }, []);

  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden",
        className
      )}
      {...props}
    >
      {model === "custom" ? (
        <img
          src={imgSrc}
          className="pointer-events-none z-50 select-none"
          alt="phone image"
        />
      ) : (
        <>
          <img
            src={modelImg}
            className="pointer-events-none z-50 select-none"
            alt="phone image"
          />

          <div className="absolute -z-10 inset-0">
            <img
              className="object-cover"
              src={imgSrc}
              alt="overlaying phone image"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Tshirt;
