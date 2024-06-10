import { currentUser } from "@clerk/nextjs/server";
import MyOrders from "./MyOrders";
import { db } from "@/db";

const Home = async () => {
  const user = await currentUser();

  const orders = await db.order.findMany({
    where: { userId: user.id },
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
    <div className="px-20 py-10">
      <MyOrders orders={orders} />
    </div>
  );
};
export default Home;
