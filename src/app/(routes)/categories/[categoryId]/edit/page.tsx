
import { redirect } from "next/navigation";
import { getCategoryAndAttributes } from "../../../../../../actions/getCategoryAndAttributes";
import { CategoryAndAttributes } from "../../../../../../types/filters";
import {CategoryForm}  from "../../_components/category-creation-form"


const CreateCategoryPage = async ({ params }: { params: { categoryId: string } }) => {
    const { categoryId } = await params;
  const categoriesAndAttributes : CategoryAndAttributes | null = await getCategoryAndAttributes({ categoryId })

  //Redirecting to creation page if couldnt load/find category from id
  if(!categoriesAndAttributes) redirect("/categories/create");
  return (
    <main className="max-w-[600px] w-full m-auto md:items-center md:justify-center h-full p-6">
        <CategoryForm existingCategory={categoriesAndAttributes}/>
    </main>
  );
};

export default CreateCategoryPage;
