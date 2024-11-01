import { getProducts } from "../../../actions/getProducts";

export default async function Home() {
  const products = await getProducts({
    attributes: {}
  })
  return (
    <main>
      {JSON.stringify(products)}
    </main>
  );
}
