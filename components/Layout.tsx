import Head from "next/head";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative">
      <Head>
        <title>Skylightz</title>
        <meta name="description" content="Skylightz NFT Mint" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative">{children}</main>
    </div>
  );
};

export default Layout;
