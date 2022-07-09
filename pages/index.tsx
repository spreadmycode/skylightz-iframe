import type { NextPage } from "next";
import Layout from "@/components/Layout";
import Mint721A from "@/components/Mint721A";

const Home: NextPage = () => {
  return (
    <Layout>
      <Mint721A />
    </Layout>
  );
};

export default Home;
