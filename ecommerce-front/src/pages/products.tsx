import Center from "@ft/components/Center";
import { mongooseConnect } from "@ft/lib/mongoose";
import { Product, ProductModel } from "@ft/models/Product";
import ProductsGrid from "@ft/components/ProductsGrid";
import Title from "@ft/components/Title";
import { Layout } from "@ft/components/Layout";

interface ProductsPageProps {
  products: Product[];
}

export default function ProductsPage({ products }: ProductsPageProps) {
  return (
    <Layout>
      <Center>
        <Title>All products</Title>
        <ProductsGrid products={products} />
      </Center>
    </Layout>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await ProductModel.find({}, null, { sort: { _id: -1 } });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
