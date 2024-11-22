
import {CategoryForm}  from "../_components/category-creation-form";

const CreateCategoryPage = async () => {
  return (
    <main className="max-w-[600px] w-full m-auto md:items-center md:justify-center h-full p-6">
        <CategoryForm/>
    </main>
  );
};

export default CreateCategoryPage;
