"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { create } from "@/app/board/actions";
import { useMutation } from "@tanstack/react-query";
import { revalidatePath } from "next/cache";

type NewBoardButtonProps = {
  orgId: string;
  disabled?: boolean;
};

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
  const router = useRouter();

  const { mutate: createBoard, isPending } = useMutation({
    mutationKey: ["create-board"],
    mutationFn: async ({ orgId, title }) => {
      await create({ orgId, title });
    },
    onError: () => {
      toast.error("Board is not created");
    },
    onSuccess: () => {
      toast.success("Board created");
      revalidatePath("/user/dashboard");
    },
  });

  return (
    <button
      disabled={isPending || disabled}
      aria-disabled={isPending || disabled}
      onClick={() => createBoard({ orgId, title: "Untitled" })}
      className={cn(
        "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg flex flex-col items-center justify-center py-6",
        isPending || disabled
          ? "opacity-75 cursor-not-allowed"
          : "hover:bg-blue-800"
      )}
    >
      <div aria-hidden />
      <Plus className="h-12 w-12 text-white stroke-1" />
      <p className="text-sm text-white font-light">New design</p>
    </button>
  );
};
