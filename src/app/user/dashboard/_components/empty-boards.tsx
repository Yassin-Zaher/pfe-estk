"use client";

import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { create } from "@/app/board/actions";

export const EmptyBoards = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { organization } = useOrganization();

  const { mutate: createBoard, isPending } = useMutation({
    mutationKey: ["create-board"],
    mutationFn: async (args) => {
      await create(args);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Board created",
        variant: "default",
      });
    },
  });

  const onClick = () => {
    console.log(organization);

    if (!organization) return;
    createBoard({ orgId: organization.id, title: "Untitled" });
  };
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/collaboration/empty-boards.svg"
        alt="Empty"
        height={110}
        width={110}
      />
      <h2 className="text-2xl font-semibold mt-6">Create your first board.</h2>

      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization.
      </p>

      <div className="mt-6">
        <Button
          disabled={isPending}
          aria-disabled={isPending}
          onClick={onClick}
          size="lg"
        >
          Create board
        </Button>
      </div>
    </div>
  );
};
