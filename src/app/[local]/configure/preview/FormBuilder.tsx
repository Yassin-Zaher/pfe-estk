import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS } from "@/validators/option-validator";
import { RadioGroup } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, PlusIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createCheckoutSession } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormBuilder = ({ model, totalPrice, userId, configId }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selected, setSelected] = useState([]);
  const [localTotalPrice, setLocalTotalPrice] = useState(totalPrice);
  const [size, setSize] = useState("Small (S)");

  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) router.push(url);
      else throw new Error("Unable to retrieve payment URL.");
    },
    onError: () => {
      toast.error("There was an error on our end. Please try again.");
    },
  });

  const handleCheckout = () => {
    if (userId) {
      createPaymentSession({
        configId,
        usrId: userId,
        productInfo: selected,
      });
    } else {
      localStorage.setItem("configurationId", id);
    }
  };

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
      size,
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

  const handleStatusChange = (status) => {
    setSize(status);
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
      {model === "tshirt" || model === "custom" ? (
        <div className="flex items-center justify-between py-2">
          <p className="font-semibold text-gray-900">Size</p>
          <p className="font-semibold text-gray-900">
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[230px]">
                <SelectValue placeholder="pick a size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>sizes</SelectLabel>
                  <SelectItem value="Small (S)">{"Small (S)"}</SelectItem>
                  <SelectItem value="Medium (M)">{"Medium (M)"}</SelectItem>
                  <SelectItem value="Large (L)">{"Large (L)"}</SelectItem>
                  <SelectItem value="Extra Large (XL)">
                    {"Extra Large (XL)"}
                  </SelectItem>
                  <SelectItem value="Double Extra Large (XXL)">
                    {"Double ExtraLarge (XXL)"}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </p>
        </div>
      ) : null}

      <>
        <div className="flex items-center justify-between py-2">
          <p className="font-semibold text-gray-900">Color</p>
          <div className="font-semibold text-gray-900">
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
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <Button onClick={handleAddSelected} className="px-4 sm:px-6 lg:px-8">
            <PlusIcon className="h-4 w-4 ml-1.5 inline" />
          </Button>
        </div>
      </>

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
                  {`Quantity: ${tag.quantity}, Color: ${tag.color}, Size ${tag.size}`}
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

      <div className="mt-8 flex justify-end pb-12">
        <Button
          onClick={() => handleCheckout()}
          className="px-4 sm:px-6 lg:px-8"
        >
          Check out <ArrowRight className="h-4 w-4 ml-1.5 inline" />
        </Button>
      </div>
    </>
  );
};

export default FormBuilder;
