import FeaturedProduct from "@ft/components/FeaturedProduct";
import { Layout } from "@ft/components/Layout";
import NewProducts from "@ft/components/NewProducts";
import { mongooseConnect } from "@ft/lib/mongoose";
import { Product, ProductModel } from "@ft/models/Product";
import { NextPage } from "next";

interface HomePageProps {
  connected: boolean;
  error?: string;
  featuredProduct: Product;
  newProducts: Product[];
}

const HomePage: NextPage<HomePageProps> = ({
  connected,
  error,
  featuredProduct,
  newProducts,
}) => {
  if (!connected) {
    return (
      <>
        <h1>There was an error connecting to the database</h1>
        <p style={{ color: "red" }}>{error}</p>
      </>
    );
  }
  return (
    <Layout>
      <FeaturedProduct product={featuredProduct} />
      <NewProducts products={newProducts} />
    </Layout>
  );
};

export async function getServerSideProps() {
  try {
    await mongooseConnect();

    const newProducts = await ProductModel.find({}, null, {
      sort: { createdAt: -1 },
      limit: 11,
    });
    return {
      props: {
        connected: true,
        featuredProduct: JSON.parse(JSON.stringify(newProducts[0])),
        newProducts: JSON.parse(JSON.stringify(newProducts)),
      },
    };
  } catch (e: any) {
    console.error(e);
    return {
      props: {
        connected: false,
        error: e.message,
      },
    };
  }
}

export default HomePage;
