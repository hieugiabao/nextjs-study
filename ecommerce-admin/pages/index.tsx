import { mongooseConnect } from "@admin/lib/mongoose";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="container">
      <Head>
        <title>E-commerce Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {isConnected ? (
          <h2 className="subtitle">You are connected to MongoDB</h2>
        ) : (
          <h2 className="subtitle">
            You are NOT connected to MongoDB. Check the console for errors.
          </h2>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    await mongooseConnect();

    return {
      props: {
        isConnected: true,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        isConnected: false,
      },
    };
  }
}
