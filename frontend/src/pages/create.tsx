import type { NextPage } from "next";
import Head from "next/head";
import { CampaignForm } from "../views";

const Create: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>PulseFund Sol</title>
        <meta
          name="description"
          content="PulseFund Sol"
        />
      </Head>
      <CampaignForm />
    </div>
  );
};

export default Create;
