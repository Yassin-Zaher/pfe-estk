"use client";
import { newProductInfoSchema } from "@/app/utils/validationSchema";
import ProductForm from "./ProductForm";
import { uploadImage } from "@/app/utils/helper";
import { ValidationError } from "yup";
import { toast } from "sonner";
import { createProduct } from "./actions";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const handleCreateProduct = async (values: NewProductInfo) => {
    try {
      const { thumbnail, images, mrp, salePrice, ...restValues } = values;

      // await newProductInfoSchema.validate(values, { abortEarly: false });
      const thumbnailRes = await uploadImage(thumbnail!);

      // Upload images
      let productImages: { url: string; id: string }[] = [];
      if (images) {
        const uploadPromise = images.map(async (imageFile) => {
          const { id, url } = await uploadImage(imageFile);
          return { id, url };
        });

        productImages = await Promise.all(uploadPromise);
      }

      // Create product
      await createProduct({
        ...restValues,
        priceBase: mrp,
        priceDiscounted: salePrice,
        thumbnail: thumbnailRes,
        images: productImages,
      });

      router.refresh();
      router.push("/products");
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.map((err) => {
          toast.error(err.message);
        });
      }
      console.error(error);
    }
  };
  return (
    <div className="h-full">
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
};
export default Page;
