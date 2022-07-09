import type { NextPage } from "next";
import Layout from "@/components/Layout";
import Mint721 from "@/components/Mint721";

const Home: NextPage = () => {
  return (
    <Layout>
      <Mint721 />
    </Layout>
  );
};

export default Home;
