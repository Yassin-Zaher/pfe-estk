import { db } from "@/db";
import ProductTable from "./_components/ProdcustTable";

const getProducts = async (pageNo: number, perPage: number) => {
  const skipCount = (pageNo - 1) * perPage;
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc", // Sorting by createdAt in descending order
      },
      skip: skipCount,
      take: perPage,
      include: {
        thumbnail: true, // Include related thumbnail data if it's a separate model
      },
    });

    return products.map((product) => {
      return {
        id: product.id,
        title: product.title,
        thumbnail: product.thumbnailUrl, // Assuming thumbnailUrl is directly in the product model
        description: product.description,
        price: {
          mrp: product.priceBase,
          salePrice: product.priceDiscounted,
          saleOff: product.priceBase,
        },
        category: product.category,
        quantity: product.quantity,
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Could not fetch products");
  }
};
const PRODUCTS_PER_PAGE = 10;

const Page = async ({ searchParams }) => {
  const { page = "1" } = searchParams;

  if (isNaN(+page)) return redirect("/404");

  const products = await getProducts(+page, PRODUCTS_PER_PAGE);
  let hasMore = true;

  if (products.length < PRODUCTS_PER_PAGE) hasMore = false;
  else hasMore = true;

  return (
    <>
      <ProductTable
        products={products}
        currentPageNo={+page}
        hasMore={hasMore}
      />
    </>
  );
};
export default Page;
