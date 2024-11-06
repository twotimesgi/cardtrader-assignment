
import { CreationForm } from "./_components/creation-form";
import { getCategories } from "../../../../actions/getCategories";


const CreateProductPage = async () => {
  const categories = await getCategories();
  return (
    <main>
        <CreationForm categories={categories}/>
    </main>
  );
};

export default CreateProductPage;
