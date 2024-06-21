"use client";

import { type FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRenameModal } from "@/store/use-rename-modal";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { updateBoard } from "@/app/[local]/board/actions";

export const RenameModal = () => {
  const router = useRouter();
  const { mutate: updateBoardMutation, isLoading } = useMutation({
    mutationKey: ["update-board"],
    mutationFn: async (args) => {
      await updateBoard(args);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
    onSuccess: () => {
      toast.success("Board updated successfully");
      router.push("/user/dashboard");
      onClose();
    },
  });

  const { isOpen, onClose, initialValues } = useRenameModal();
  const [title, setTitle] = useState(initialValues.title);

  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues.title]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    updateBoardMutation({ id: initialValues.id, title });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit board title</DialogTitle>
        </DialogHeader>

        <DialogDescription>Enter a new title for this board.</DialogDescription>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            disabled={isLoading}
            aria-disabled={isLoading}
            required
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board title"
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={isLoading}
              aria-disabled={isLoading}
              type="submit"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
