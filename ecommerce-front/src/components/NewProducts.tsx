import styled from "styled-components";
import Center from "@ft/components/Center";
import ProductsGrid from "@ft/components/ProductsGrid";
import { Product } from "@ft/models/Product";

const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 20px;
  font-weight: normal;
`;

interface NewProductsProps {
  products: Product[];
}

export default function NewProducts({ products }: NewProductsProps) {
  return (
    <Center>
      <Title>New Arrivals</Title>
      <ProductsGrid products={products} />
    </Center>
  );
}
