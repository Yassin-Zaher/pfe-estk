import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import Orders from "../_components/Orders";

const Page = async () => {
  const user = await currentUser();
  const ADMIN_EMAIL = "yassinzaherpro@gmail.com";

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        // get me the order from the last week
        gte: new Date(new Date().setDate(new Date().getDate() - 15)),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      shippingAddress: true,
      configuration: true,
    },
  });

  return (
    <div className="flex min-h-screen w-full  px-20">
      <Orders orders={orders} />
    </div>
  );
};

export default Page;
