import { Filters } from "@/components/filters";
import { ProductsContainer } from "../../_components/products-container";
import { MotionDiv } from "@/components/motion-div";
import { getFilters } from "../../../../../actions/getFilters";
import { getCategory } from "../../../../../actions/getCategory";

const PAGE_SIZE = 10;

const Home = async ({ params }: { params: { categoryId: string }}) => {
  const { categoryId } = await params;
  const filters = await getFilters({ categoryId });
  const category = await getCategory({ categoryId });

  if (category)
    return (
      <main className="p-4 max-w-[1920px] m-auto">
        <MotionDiv layoutRoot className="flex w-full">
          <Filters filters={filters} />
          <MotionDiv className="w-full">
            <ProductsContainer categoryId={categoryId} categoryName={category.name}/>
          </MotionDiv>
        </MotionDiv>
      </main>
    );
};

export default Home;
