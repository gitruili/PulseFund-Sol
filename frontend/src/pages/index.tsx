import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>PulseFund Sol</title>
        <meta
          name="description"
          content="PulseFund Sol"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
