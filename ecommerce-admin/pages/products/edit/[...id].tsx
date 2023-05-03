import Layout from "@admin/components/Layout";
import ProductForm from "@admin/components/ProductForm";
import { Product } from "@admin/models/Product";
import axios from "axios";
import { useRouter } from "next/router";
import { ScaleLoader } from "react-spinners";
import { Fetcher } from "swr";
import useSWR from "swr";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const productFetcher: Fetcher<Product, string> = (url) =>
    axios.get(url).then((res) => res.data);

  const {
    data: product,
    isLoading,
    mutate,
    error,
  } = useSWR("/api/products?id=" + id, productFetcher, {
    keepPreviousData: true,
  });

  if (error) {
    return <Layout>{error.message}</Layout>;
  }

  return (
    <Layout>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <ScaleLoader color="#1E3A8A" />
        </div>
      ) : (
        <>
          <h1>Edit Product</h1>
          {product && <ProductForm product={product} />}
        </>
      )}
    </Layout>
  );
}
