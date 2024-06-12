"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { BoardCard } from "./board-card";
import { EmptyBoards } from "./empty-boards";
import { EmptyFavourites } from "./empty-favourites";
import { EmptySearch } from "./empty-search";
import { NewBoardButton } from "./new-board-button";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getBoards } from "@/app/board/actions";

type BoardListProps = {
  orgId: string;
  query: {
    search?: string;
    favourites?: string;
  };
};

export const BoardList = ({ orgId, query }: BoardListProps) => {
  const { userId } = useAuth();

  const queryKey = ["getBoards", { orgId, ...query }];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const data = await getBoards({ orgId, userId, ...query });
      return data;
    },
    //enabled: !!userId,
    onError: () => {
      toast.error("Something went wrong");
    },
    onSuccess: () => {
      toast.success("Boards fetched successfully");
    },
  });

  if (isLoading)
    return (
      <div>
        <h2 className="text-3xl">
          {query.favourites ? "Favourite boards" : "Team boards"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data.length && query.favourites) {
    return <EmptyFavourites />;
  }

  if (!data?.length) {
    return <EmptyBoards />;
  }

  return (
    <div>
      <h2 className="text-3xl">
        {query.favourites ? "Favourite boards" : "Team boards"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} disabled={isLoading} />
        {data?.map((board) => (
          <BoardCard
            key={board.id}
            id={board.id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board.createdAt}
            orgId={board.orgId}
            userId={userId}
            isFavourite={board.isFavourite}
          />
        ))}
      </div>
    </div>
  );
};
