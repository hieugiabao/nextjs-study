// import { Category } from "@admin/models";
import { Product } from "@admin/models/Product";
import { Property } from "@admin/models/Property";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import useSWR, { Fetcher } from "swr";
import Spinner from "./Spinner";
import { Category } from "@admin/models/Category";

interface ProductFormProps {
  product?: Product;
}

interface ImageItem {
  id: number;
  src: string;
}

export default function ProductForm(props: ProductFormProps) {
  console.log("len");
  const [product, setProduct] = useState<Product>(
    props.product || {
      title: "",
      price: 0,
      description: "",
      images: [],
      category: "",
      properties: {},
    }
  );
  const [propertiesToFill, setPropertiesToFill] = useState<Property[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const categoriesFetcher: Fetcher<Category[], string> = (url) =>
    axios.get(url).then((result) => result.data);
  const router = useRouter();

  const { data: categories } = useSWR("/api/categories", categoriesFetcher, {
    fallbackData: [],
  });
  console.log(categories);

  async function saveProduct(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (product._id) {
      await axios.put("/api/products", product);
    } else {
      await axios.post("/api/products", product);
    }
    router.push("/products");
  }

  async function uploadImages(ev: React.ChangeEvent<HTMLInputElement>) {
    const files = ev.target.files;
    if (files?.length && files.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) data.append("file", file);
      const res = await axios.post("/api/upload", data);
      setProduct((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...res.data.links],
      }));
      setIsUploading(false);
    }
  }

  useEffect(() => {
    const properties = [];
    if (categories.length > 0 && product.category) {
      let cateInfo = categories.find(
        ({ _id }) => _id === product.category?.toString()
      );
      if (cateInfo) {
        properties.push(...cateInfo.properties!);
        while ((cateInfo?.parent as any)?._id) {
          const parentCat = categories.find(
            ({ _id }) => _id === (cateInfo?.parent as any)?._id
          );
          if (parentCat) properties.push(...parentCat.properties!);
          cateInfo = parentCat;
        }
      }
    }
    setPropertiesToFill(properties);
  }, [categories, product]);

  return (
    <form onSubmit={saveProduct}>
      <label htmlFor="p_name">Product Name</label>
      <input
        type="text"
        id="p_name"
        value={product.title}
        onChange={(ev) => setProduct({ ...product, title: ev.target.value })}
      />
      <label htmlFor="p_category">Category</label>
      <select
        value={product.category?.toString()}
        onChange={(ev) =>
          setProduct((prev) => ({
            ...prev,
            category: ev.target.value,
          }))
        }
        id="p_category"
      >
        <option value="">--No select--</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name}>
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={product.properties?.[p.name]}
                onChange={(ev) => {
                  if (!product.properties) {
                    product.properties = {};
                  }
                  product.properties[p.name] = ev.target.value;
                }}
              >
                {p.values.map((v) => (
                  <option value={v} key={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label htmlFor="">Photos</label>
      <div className="flex flex-wrap gap-1 mb-2">
        <ReactSortable<ImageItem>
          list={
            product.images?.map((link, index) => ({ id: index, src: link })) ||
            []
          }
          setList={(images) =>
            setProduct((prev) => ({
              ...prev,
              images: images.map(({ src }) => src),
            }))
          }
          className="flex flex-wrap gap-1"
        >
          {!!product.images?.length &&
            product.images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <Image
                  src={link}
                  className="rounded-lg"
                  alt=""
                  height={24}
                  width={24}
                />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={product.description}
        onChange={(ev) =>
          setProduct((prev) => ({
            ...prev,
            description: ev.target.value,
          }))
        }
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        step="0.01"
        placeholder="price"
        value={product.price}
        onChange={(ev) =>
          setProduct((prev) => ({
            ...prev,
            price: Number(ev.target.value),
          }))
        }
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
