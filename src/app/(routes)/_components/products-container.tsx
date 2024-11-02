import { ProductCard } from "@/components/product-card";
import { getProducts } from "../../../../actions/getProducts";
import { MotionDiv } from "@/components/motion-div";
import { Product } from "@prisma/client";
 export const Products = async ({products} : {products: Product[]}) => {
  // Define animation variants for opacity and x
  const productCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4 w-full">
      {products.map((product) =>

          <MotionDiv
            key={`${product.id}`}
            variants={productCardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <ProductCard
              id={product.id}
              model={product.model}
              brand={product.brand}
              productImageUrls={[
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/32c4e533-1f15-472c-bb50-28570ce5e766/ZM+VAPOR+16+ELITE+FG.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5c191f19-9304-41b5-9a6e-aa31a18c4dcc/ZM+VAPOR+16+ELITE+FG.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fa829b33-2547-4479-9e85-43f14e2ed593/ZM+VAPOR+16+ELITE+FG.png",
              ]}
              price={product.price}
            />
          </MotionDiv>
      
      )}
    </div>
  );
};
