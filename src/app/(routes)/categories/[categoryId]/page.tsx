import { Filters } from "@/components/filters";
import { ProductsContainer } from "../../../../components/products-container";
import { MotionDiv } from "@/components/motion-div";
import { getFilters } from "../../../../../actions/getFilters";
import { getCategory } from "../../../../../actions/getCategory";
import { SearchBar } from "../../../../components/search-bar";
import { MobileFilters } from "@/components/mobile-filters";
import { CategoryAndAttributes, Filter } from "../../../../../types/filters";
import { Category } from "@prisma/client";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";

const Home = async ({ params }: { params: { categoryId: string } }) => {
  const { categoryId } = await params;
  const filters: Filter[] = await getFilters({ categoryId });
  const category: Category | null = await getCategory({ categoryId });

  //Redirecting if couldn't fetch category
  if (!category) redirect("/");

  return (<>
      <Header/>
    <main className="p-4 max-w-[1920px] m-auto">
      <MotionDiv layoutRoot className="flex w-full">
        <Filters filters={filters} className="hidden lg:block" />
        <MotionDiv className="w-full">
          <SearchBar filters={filters} />
          <ProductsContainer
            categoryId={categoryId}
            categoryName={category.name}
          />
        </MotionDiv>
      </MotionDiv>
    </main>
    </>

  );
};

export default Home;
