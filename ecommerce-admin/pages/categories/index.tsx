import Layout from "@admin/components/Layout";
import { Category } from "@admin/models/Category";
import axios from "axios";
import { useState } from "react";
import { withSwal } from "react-sweetalert2";
import useSWR, { Fetcher } from "swr";

interface CategoryPageProps {
  swal: any;
}

function CategoryPage({ swal }: CategoryPageProps) {
  const categoriesFetcher: Fetcher<Category[]> = (url: string) =>
    axios.get(url).then((res) => res.data);
  const [properties, setProperties] = useState<
    {
      name: string;
      values: string;
    }[]
  >([]);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState<string | undefined>("");
  const [editedCategory, setEditedCategory] = useState<Category>();

  const { data: categories, mutate } = useSWR(
    "/api/categories",
    categoriesFetcher,
    {
      fallbackData: [],
    }
  );

  async function saveCategory(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        ...property,
        values: property.values.split(",").map((value) => value.trim()),
      })),
    };

    if (editedCategory) {
      const edit = {
        ...data,
        _id: editedCategory._id,
      };
      await axios.put("/api/categories", edit);
      mutate(categories.map((category) => category));
      setEditedCategory(undefined);
      mutate(
        categories.map((category) =>
          category._id === editedCategory._id ? edit : category
        )
      );
    } else {
      const categoryResponse = await axios.post("/api/categories", data);
      mutate([...categories, categoryResponse.data]);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
  }

  function editCategory(category: Category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory((category.parent as any)?._id);
    setProperties(
      category.properties?.map(({ name, values }) => ({
        name,
        values: values.join(", "),
      })) || []
    );
  }

  function deleteCategory(category: Category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result: any) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("api/categories?_id=" + _id);
          mutate(categories.filter((cate) => cate._id !== _id));
        }
      })
      .catch(console.error);
  }

  function addProperty() {
    setProperties((prev) => [
      ...prev,
      {
        name: "",
        values: "",
      },
    ]);
  }

  function handlePropertyNameChange(index: number, newName: string) {
    setProperties((prev) =>
      prev.map((property, _index) =>
        index === _index
          ? {
              ...property,
              name: newName,
            }
          : property
      )
    );
  }

  function handlePropertyValuesChange(index: number, newValues: string) {
    setProperties((prev) =>
      prev.map((property, _index) =>
        index === _index
          ? {
              ...property,
              values: newValues,
            }
          : property
      )
    );
  }

  function removeProperty(indexToRemove: number) {
    setProperties((prev) =>
      [...prev].filter((p, pIndex) => pIndex !== indexToRemove)
    );
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label htmlFor="">
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : `Create new category`}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value="">No parent category</option>
            {categories?.length > 0 &&
              categories.map((category, index) => (
                <option key={category._id} value={category._id || index}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="" className="block">
            Properties
          </label>
          <button
            className="btn-default text-sm mb-2"
            onClick={addProperty}
            type="button"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  type="text"
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyNameChange(index, ev.target.value)
                  }
                  value={property.name}
                  placeholder="property name (example: color)"
                />
                <input
                  type="text"
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, ev.target.value)
                  }
                  value={property.values}
                  placeholder="values, comma separated"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-red"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              className="btn-default"
              type="button"
              onClick={() => {
                setEditedCategory(undefined);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
          <button className="btn-primary py-1" type="submit">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{(category?.parent as any)?.name}</td>
                  <td className="text-right">
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(CategoryPage);
