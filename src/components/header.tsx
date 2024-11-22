import { Category } from "@prisma/client";
import { getCategories } from "../../actions/getCategories";
import Link from "next/link";

export const Header = async () => {
    const categories = await getCategories();
    
  return (
    <header>
     <nav className="w-full py-4 px-4 overflow-x-scroll flex gap-10 no-scrollbar bg-black/90 ">
     <Link href={`/`}
      className={"text-l text-nowrap text-white/70 hover:text-white"}
      >All products</Link>
      {categories.map((category : Category) => <Link href={`/categories/${category.id}`} key={category.id} 
      className={"text-l text-nowrap text-white/70 hover:text-white"}
      >{category.name}</Link>
      )}
    </nav>
    </header>
  );
}