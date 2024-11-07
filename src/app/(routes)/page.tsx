import { Category } from "@prisma/client";
import { getCategories } from "../../../actions/getCategories";

export default async function Home() {
  const categories = await getCategories();
  return (
    
    <main>
      {categories.map((category : Category) => <div key={category.id}>{category.name} {category.id}</div>
      )}
    </main>
  );
}
