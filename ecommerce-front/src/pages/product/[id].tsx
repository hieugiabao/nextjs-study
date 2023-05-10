import Center from "@ft/components/Center";
import Header from "@ft/components/Header";
import Title from "@ft/components/Title";
import { mongooseConnect } from "@ft/lib/mongoose";
import { Product, ProductModel } from "@ft/models/Product";
import styled from "styled-components";
import WhiteBox from "@ft/components/WhiteBox";
import ProductImages from "@ft/components/ProductImages";
import Button from "@ft/components/Button";
import CartIcon from "@ft/components/icons/CartIcon";
import { useContext } from "react";
import { CartContext } from "@ft/context/cart-context";
import { GetServerSideProps } from "next";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;

interface ProductPageProps {
  product: Product;
}

export default function ProductPage({ product }: ProductPageProps) {
  const { addProduct } = useContext(CartContext);
  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images || []} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div>
                <Price>${product.price}</Price>
              </div>
              <div>
                <Button primary={1} onClick={() => addProduct(product._id!)}>
                  <CartIcon />
                  Add to cart
                </Button>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
      </Center>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (
  context
) => {
  await mongooseConnect();
  const { id } = context.query;
  const product = await ProductModel.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
};
