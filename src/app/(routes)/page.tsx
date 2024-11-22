import { Filters } from "@/components/filters";
import { ProductsContainer } from "@/components/products-container";
import { MotionDiv } from "@/components/motion-div";
import { getFilters } from "../../../actions/getFilters";
import { SearchBar } from "@/components/search-bar";
import { MobileFilters } from "@/components/mobile-filters";
import { Filter } from "../../../types/filters";
import { Category } from "@prisma/client";
import { Header } from "@/components/header";

const Home = async () => {
    return (
      
      <>
      <Header/>
      <main className="p-4 max-w-[1920px] m-auto">
        <MotionDiv layoutRoot className="flex w-full">
          <MotionDiv className="w-full">
            <SearchBar />
            <ProductsContainer/>
          </MotionDiv>
        </MotionDiv>
      </main>
      </>
    );
};

export default Home;
