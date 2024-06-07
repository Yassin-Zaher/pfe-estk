"use client";

import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { Actions } from "@/components/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";

import { Footer } from "./footer";
import { Overlay } from "./overlay";
import { useMutation } from "@tanstack/react-query";
import { favouriteBoard, unfavouriteBoard } from "@/app/board/actions";

type BoardCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  orgId: string;
  isFavourite: boolean;
};

export const BoardCard = ({
  id,
  title,
  imageUrl,
  authorId,
  authorName,
  createdAt,
  orgId,
  isFavourite,
}: BoardCardProps) => {
  const { userId } = useAuth();

  const authorLabel = userId === authorId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  const { mutate: favouriteBoardMutation, isLoading: pendingFavourite } =
    useMutation({
      mutationKey: ["favourite-board"],
      mutationFn: async (args) => {
        await favouriteBoard(args);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
      onSuccess: () => {
        toast.success("Board favourited successfully");
      },
    });
  const { mutate: unFavouriteBoardMutation, isLoading: pendingUnfavourite } =
    useMutation({
      mutationKey: ["favourite-board"],
      mutationFn: async (args) => {
        await unfavouriteBoard(args);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
      onSuccess: () => {
        toast.success("Board unfavourited successfully");
      },
    });

  const toggleFavourite = async () => {
    if (isFavourite) {
      unFavouriteBoardMutation({ id });
    } else favouriteBoardMutation({ id, orgId });
  };

  return (
    <Link href={`/user/${id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt={title} fill className="object-fit" />
          <Overlay />
          <Actions id={id} title={title} side="right">
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>

        <Footer
          isFavourite={isFavourite}
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          onClick={toggleFavourite}
          disabled={pendingFavourite || pendingUnfavourite}
        />
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="aspect-[100/127] rounded-lg flex overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
