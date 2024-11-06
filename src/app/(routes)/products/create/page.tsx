
import { CreationForm } from "./_components/product-creation-form";
import { getCategories } from "../../../../../actions/getCategories";


const CreateProductPage = async () => {
  const categories = await getCategories();
  return (
    <main className="max-w-[600px] w-full m-auto md:items-center md:justify-center h-full p-6">
        <CreationForm categories={categories}/>
    </main>
  );
};

export default CreateProductPage;
