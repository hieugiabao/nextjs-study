import { mongooseConnect } from "@ft/lib/mongoose";
import { NextPage } from "next";

interface HomePageProps {
  connected: boolean;
  error?: string;
}

const HomePage: NextPage<HomePageProps> = ({ connected, error }) => {
  if (!connected) {
    return (
      <>
        <h1>There was an error connecting to the database</h1>
        <p>{error}</p>
      </>
    );
  }
  return (
    <>
      <h1>Connected to the database</h1>
    </>
  );
};

export async function getServerSideProps() {
  try {
    await mongooseConnect();

    return {
      props: {
        connected: true,
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
