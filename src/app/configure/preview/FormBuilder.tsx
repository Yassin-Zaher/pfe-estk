import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS } from "@/validators/option-validator";
import { RadioGroup } from "@headlessui/react";
import { PlusIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FormBuilder = ({ model, totalPrice, onSubmit }) => {
  console.log(totalPrice);

  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selected, setSelected] = useState([]);
  const [localTotalPrice, setLocalTotalPrice] = useState(totalPrice);

  const inputRef = useRef(null);

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleAddSelected = () => {
    const newSelection = {
      quantity,
      color: selectedColor.label,
    };

    // Update the selected state with the new item
    const updatedSelected = [...selected, newSelection];
    setSelected(updatedSelected);

    // Calculate the new total price based on the updated selected state
    const newTotalPrice = updatedSelected.reduce(
      (total, item) => total + item.quantity * totalPrice,
      0
    );
    setLocalTotalPrice(newTotalPrice);
    //console.log(selected);
  };

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  return (
    <>
      <div className="flex items-center justify-between py-2">
        <p className="font-semibold text-gray-900">Quantity</p>
        <p className="font-semibold text-gray-900">
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder="1"
          />
        </p>
      </div>
      <div className="flex items-center justify-between py-2">
        <p className="font-semibold text-gray-900">Color</p>
        <p className="font-semibold text-gray-900">
          <RadioGroup value={selectedColor} onChange={handleColorChange}>
            <div className="mt-3 flex items-center space-x-3">
              {COLORS.map((color) => (
                <RadioGroup.Option
                  key={color.label}
                  value={color}
                  className={({ active, checked }) =>
                    cn(
                      "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                      {
                        [`border-${color.tw}`]: active || checked,
                      }
                    )
                  }
                >
                  <span
                    className={cn(
                      `bg-${color.tw}`,
                      "h-8 w-8 rounded-full border border-black border-opacity-10"
                    )}
                  />
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </p>
      </div>
      <div className="flex items-center justify-between py-2">
        <Button onClick={handleAddSelected} className="px-4 sm:px-6 lg:px-8">
          <PlusIcon className="h-4 w-4 ml-1.5 inline" />
        </Button>
      </div>
      <div className="py-2">
        {selected?.length ? (
          <div className="text-xs flex flex-wrap gap-1 p-2 mb-2">
            {selected.map((tag, idx) => {
              return (
                <div
                  key={idx}
                  className="rounded-full w-fit py-1.5 px-3 border border-gray-400 bg-gray-50 text-gray-500
                  flex items-center gap-2"
                >
                  {`Quantity: ${tag.quantity}, Color: ${tag.color}`}
                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      setSelected(selected.filter((_, i) => i !== index))
                    }
                  ></div>
                </div>
              );
            })}
            <div className="w-full text-right">
              <span
                className="text-gray-400 cursor-pointer"
                onClick={() => {
                  setSelected([]);
                  setLocalTotalPrice(totalPrice);
                }}
              >
                Clear all
              </span>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between py-2">
        <p className="font-semibold text-gray-900">Order total</p>
        <p className="font-semibold text-gray-900">
          {formatPrice(localTotalPrice / 100)}
        </p>
      </div>
    </>
  );
};

export default FormBuilder;
