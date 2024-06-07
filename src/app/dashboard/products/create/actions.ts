"use server";
import { uploadImage } from "@/app/utils/helper";
import { db } from "@/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUD_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUD_API_SECRET,
  secure: true,
});

export const getCloudConfig = async () => {
  return {
    name: process.env.NEXT_PUBLIC_CLOUD_NAME!,
    key: process.env.NEXT_PUBLIC_CLOUD_API_KEY!,
  };
};

// generate our cloud signature
export const getCloudSignature = async () => {
  const secret = cloudinary.config().api_secret!;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp }, secret);

  return { timestamp, signature };
};

export const createProduct = async (info: NewProduct) => {
  try {
    const { thumbnail, images, ...product } = info;

    // Ensure thumbnail is already uploaded and contains id and url
    const thumbnailId = thumbnail.id;
    const thumbnailUrl = thumbnail.url;

    const bulletPoints = product.bulletPoints.map((point) => ({ point }));
    const imageRecords = images?.map((image) => ({ url: image.url })) || [];

    const createdProduct = await db.product.create({
      data: {
        ...product,
        thumbnailUrl,
        thumbnailId,
        bulletPoints: {
          create: bulletPoints,
        },
        images: {
          create: imageRecords,
        },
      },
    });

    return createdProduct;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong, can not create product!");
  }
};
