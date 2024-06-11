"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db, syncUser } from "@/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { Order } from "@prisma/client";

export const createCheckoutSession = async ({
  configId,
  usrId,
  productInfo,
}) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  let user = await db.user.findUnique({
    where: { id: usrId },
  });
  if (!user) {
    user = await syncUser(usrId);
  }

  const userId = user.id;

  const { finish, material, model } = configuration;

  let price = BASE_PRICE;
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;
  if (model === "custom" && Array.isArray(productInfo)) {
    price = price * productInfo.length;
  }

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: userId,
      configurationId: configuration.id,
    },
  });

  console.log(userId, configuration.id);

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        isPaid: true,
        amount: price / 100,
        userId: userId,
        prodcutDetails: JSON.stringify(productInfo),
        configurationId: configuration.id,
      },
    });
  }

  const product = await stripe.products.create({
    name: "Custom Design",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["MA", "US"] },
    metadata: {
      userId: userId,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
};
