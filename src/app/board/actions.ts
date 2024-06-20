"use server";
import { db } from "@/db";
import { currentUser, getAuth } from "@clerk/nextjs/server";

import { useMutation } from "@tanstack/react-query";

const images = [
  "/collaboration/placeholders/1.svg",
  "/collaboration/placeholders/2.svg",
  "/collaboration/placeholders/3.svg",
  "/collaboration/placeholders/4.svg",
  "/collaboration/placeholders/5.svg",
  "/collaboration/placeholders/6.svg",
  "/collaboration/placeholders/7.svg",
  "/collaboration/placeholders/8.svg",
  "/collaboration/placeholders/9.svg",
  "/collaboration/placeholders/10.svg",
];

export const create = async ({ orgId, title }) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized.");

  const randomImage = images[Math.floor(Math.random() * images.length)];

  const board = await db.board.create({
    data: {
      title,
      orgId,
      authorId: user.id!,
      authorName: user.firstName!,
      imageUrl: randomImage,
    },
  });

  return board.id;
};

type GetBoardsInput = {
  orgId: string;
  userId: string;
  search?: string;
  favourites?: string;
};
export const getBoards = async ({
  orgId,
  userId,
  search,
  favourites,
}: GetBoardsInput) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("Unauthorized.");

  if (favourites) {
    const favouritedBoards = await db.userFavourite.findMany({
      where: {
        userId: user.id,
        orgId,
      },
      include: {
        Board: true,
      },
    });
    const boards = favouritedBoards.map((favourite) => ({
      ...favourite.Board,
      isFavourite: true,
    }));
    console.log("[FAVORITE TRUE]");

    console.log(boards);

    return boards;
  }

  let boards;

  if (search) {
    boards = await db.board.findMany({
      where: {
        orgId,
        title: {
          contains: search,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("[SEARCH TRUE]");

    console.log(boards);
  } else {
    boards = await db.board.findMany({
      where: {
        orgId,
      },
      include: {
        userFavourites: {
          where: { userId: user.id },
          select: { id: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  const boardsWithFavouriteRelation = boards.map(async (board) => {
    const favourite = await db.userFavourite.findUnique({
      where: {
        userId_boardId: {
          userId: user.id,
          boardId: board.id,
        },
      },
    });

    return {
      ...board,
      isFavourite: !!favourite,
    };
  });

  const boardsWithFavouriteBoolean = await Promise.all(
    boardsWithFavouriteRelation
  );
  console.log(boardsWithFavouriteBoolean);

  return boardsWithFavouriteBoolean;
};

export const removeBoard = async ({ id }) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized.");

  // Check if the board exists and the user is the author
  const board = await db.board.findUnique({
    where: {
      id: id,
    },
  });

  if (!board) throw new Error("Board not found.");

  if (board.authorId !== user.id)
    throw new Error("Unauthorized to delete this board.");

  // Delete the board
  await db.board.delete({
    where: {
      id: id,
    },
  });

  return { success: true };
};

export const updateBoard = async ({ id, title }) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized.");

  const trimmedTitle = title.trim();

  if (!trimmedTitle) throw new Error("Title is required.");

  if (trimmedTitle.length > 60)
    throw new Error("Title cannot be longer than 60 characters.");

  // Check if the board exists and the user is the author
  const board = await db.board.findUnique({
    where: {
      id: id,
    },
  });

  if (!board) throw new Error("Board not found.");

  if (board.authorId !== user.id)
    throw new Error("Unauthorized to update this board.");

  // Update the board
  const updatedBoard = await db.board.update({
    where: {
      id: id,
    },
    data: {
      title: trimmedTitle,
    },
  });

  return updatedBoard;
};

export const favouriteBoard = async ({ id, orgId }) => {
  const user = await currentUser();

  if (!user.id) throw new Error("Unauthorized.");

  // Check if the board exists
  const board = await db.board.findUnique({
    where: { id },
  });

  if (!board) throw new Error("Board not found.");

  // Check if the board is already favourited
  const existingFavourite = await db.userFavourite.findUnique({
    where: {
      userId_boardId: {
        userId: user.id,
        boardId: id,
      },
    },
  });

  if (existingFavourite) throw new Error("Board already favourited.");

  // Favourite the board
  await db.userFavourite.create({
    data: {
      userId: user.id,
      boardId: id,
      orgId,
    },
  });

  return { id, isFavourite: true };
};

export const unfavouriteBoard = async ({ id }) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized.");

  const userId = user.id;

  // Check if the board exists
  const board = await db.board.findUnique({
    where: { id },
  });

  if (!board) throw new Error("Board not found.");

  // Check if the board is favourited
  const existingFavourite = await db.userFavourite.findUnique({
    where: {
      userId_boardId: {
        userId,
        boardId: id,
      },
    },
  });

  if (!existingFavourite) throw new Error("Favourited board not found.");

  // Unfavourite the board
  await db.userFavourite.delete({
    where: {
      id: existingFavourite.id,
    },
  });

  return { id, isFavourite: false };
};

export const getBoard = async ({ id }) => {
  const board = await db.board.findUnique({
    where: { id },
  });

  if (!board) {
    throw new Error("Board not found.");
  }

  return board;
};
