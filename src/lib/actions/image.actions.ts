"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";

import { v2 as cloudinary } from "cloudinary";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    const newImage = await db.image.create({
      data: {
        ...image,
        authorId: userId,
      },
    });

    revalidatePath(path);

    return newImage;
  } catch (error) {
    console.log(error);
  }
}

// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    // Find the image to update
    const imageToUpdate = await db.image.findUnique({
      where: { id: image.id },
    });

    if (!imageToUpdate || imageToUpdate.authorId !== userId) {
      throw new Error("Unauthorized or image not found");
    }

    // Update the image
    const updatedImage = await db.image.update({
      where: { id: image.id },
      data: {
        ...image,
      },
    });

    // Call revalidatePath or any similar function to revalidate cache
    // Note: revalidatePath is not a built-in function, implement as per your requirement
    revalidatePath(path);

    return updatedImage;
  } catch (error) {
    handleError(error);
  }
}

// DELETE IMAGE

export async function deleteImage(imageId: string) {
  try {
    // Delete the image
    await db.image.delete({
      where: { id: imageId },
    });
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/dashboard");
  }
}

// GET IMAGE

export async function getImageById(imageId: string) {
  try {
    // Fetch the image and include the related user data
    const image = await db.image.findUnique({
      where: { id: imageId },
      include: { author: true },
    });

    if (!image) {
      throw new Error("Image not found");
    }

    return image;
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGES

export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = "folder=imaginify";

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourceIds = resources.map((resource: any) => resource.public_id);

    const skipAmount = (Number(page) - 1) * limit;

    let where = {};

    if (searchQuery) {
      where = {
        publicId: {
          in: resourceIds,
        },
      };
    }

    const images = await db.image.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      skip: skipAmount,
      take: limit,
      include: {
        author: true, // assuming you want to include the author details
      },
    });

    const totalImages = await db.image.count({ where });
    const savedImages = await db.image.count();

    return {
      data: images,
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGES BY USER

export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const images = await db.image.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: skipAmount,
      take: limit,
      include: {
        author: true, // Assuming you want to include author details
      },
    });

    const totalImages = await db.image.count({
      where: {
        authorId: userId,
      },
    });

    return {
      data: images,
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
