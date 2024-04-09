// Next, React
import { FC, useEffect, useState } from 'react';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

import * as anchor from "@coral-xyz/anchor";
// import { DeAnnoTokenProgram } from 'models/de_anno_token_program';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from "../../idl/idl.json";
import {
  web3,
  BN,
} from "@project-serum/anchor";
import CampaignCard from './CampaignCard';
import { useRouter } from 'next/router';

interface Campaign {
  id: number;
  name: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  investorsCount: number;
  remainingDays: number;
  imageUrl: string;
}

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  // const connection = new Connection('https://api.devnet.solana.com');
  const programId = new PublicKey(idl.metadata.address);

  const [campaigns, setCampaigns] = useState([]);

  // Example function to convert InitialData to Campaign
  function convertToCampaign(data: any[], startId: number = 1): Campaign[] {
    return data.map((item, index): Campaign => ({
      id: startId + index, // Assuming IDs start from `startId` and increment by 1 for each item
      name: item.name,
      description: item.description,
      goalAmount: item.targetAmount.words[0],
      raisedAmount: item.amountDonated.words[0], // Example static value
      investorsCount: 0, // Example static value
      remainingDays: 30, // Example static value
      imageUrl: item.projectUrl, // Example static placeholder
    }));
  }

  const getAllCampaigns = async () => {
    // this can be set in to a state and displayed on the frontend can be utilized in the useEffect hook
    // const connection = new Connection(network, opts.preflightCommitment);
    const provider = new anchor.AnchorProvider(connection, wallet, {});
    const program = new anchor.Program(idl as anchor.Idl, programId, provider);
    Promise.all(
      (await connection.getProgramAccounts(programId)).map(async campaign => ({
        ...(await program.account.campaign.fetch(campaign.pubkey)),
        pubkey: campaign.pubkey,
      })),
    ).then(campaigns => {
      console.log('campaigns', campaigns);
      const temp: any[] = campaigns;
      const campaignsData: Campaign[] = convertToCampaign(temp);
      setCampaigns(campaignsData);
    });
  };

  useEffect(() => {
    (async () => {
      // get all campaigns
      await getAllCampaigns();
    })();
  }, []);

  const getCampaign = async () => {
    // this can be set in to a state and displayed on the frontend
    try {
      const provider = new anchor.AnchorProvider(connection, wallet, {});
      const program = new anchor.Program(idl as anchor.Idl, programId, provider);

      const [campaign] = await PublicKey.findProgramAddress(
        [ 
          // utils.bytes.utf8.encode("PROJECT_CROWDFUND"),
          Buffer.from("CROWDFUND"),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId,
      );
  
      const eachCampaign = await program.rpc.getCampaign({
        accounts: {
          campaign: campaign,
          user: provider.wallet.publicKey,
        },
      });
      console.log("Your getCampaign transaction signature", eachCampaign);
    } catch (error) {
      console.error("Error getting campaign:", error);
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  // useEffect(() => {
  //   const init = async () => {
  //     if (wallet.publicKey) {
  //       const withdraw_limit_init = new anchor.BN(100);
  //       const provider = new anchor.AnchorProvider(connection, wallet, {});
  //       const program = new anchor.Program(idl as anchor.Idl, programId, provider);
  //       const userPublicKey = wallet.publicKey;
  //       const [userPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //         [Buffer.from("worker"), userPublicKey.toBuffer()],
  //         program.programId
  //       );
  
  //       try {
  //         const tx = await program.methods
  //           .initWorker(withdraw_limit_init)
  //           .accounts({
  //             worker: userPublicKey, // Use userPublicKey here
  //             workerData: userPDA,
  //           })
  //           // No need to include "signers" here as the transaction will be signed by the connected wallet
  //           .rpc();
  //         console.log("Your transaction signature", tx);
  
  //         const userData = await program.account.workerData.fetch(userPDA);
  //       } catch (error) {
  //         console.error("Error in transaction:", error);
  //       }
  //     }
  //   };
  
  //   init(); // Call the async function
  // }, [wallet.publicKey, connection]); // Depend on wallet.publicKey and connection  

  const handleCreate = () => {
    router.push('/create');
    // createCampaign();
  }

  // const activeCampaigns: Campaign[] = [
  //   {
  //     id: 1,
  //     title: "title",
  //     description: "desc",
  //     goalAmount: 200,
  //     raisedAmount: 12,
  //     investorsCount: 22,
  //     remainingDays: 2,
  //     imageUrl: "./solanaLogo.png",
  //   },
  //   {
  //     id: 2,
  //     title: "title",
  //     description: "desc",
  //     goalAmount: 200,
  //     raisedAmount: 12,
  //     investorsCount: 22,
  //     remainingDays: 2,
  //     imageUrl: "./solanaLogo.png",
  //   },
  //   {
  //     id: 3,
  //     title: "title",
  //     description: "desc",
  //     goalAmount: 200,
  //     raisedAmount: 12,
  //     investorsCount: 22,
  //     remainingDays: 2,
  //     imageUrl: "./solanaLogo.png",
  //   }
  // ];

  // Header component with welcome message and search bar
  const Header: React.FC = () => (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Welcome</h1>
      {/* <div className="relative">
        <input type="search" placeholder="Search Campaigns" className="p-2 border-2 border-gray-300 rounded-md" />
        <button className="absolute right-2 top-2">🔍</button>
      </div> */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCreate}>
        Create Campaign
      </button>
    </div>
  );

  // ActiveCampaignsSection component
  interface CampaignsSectionProps {
    campaigns: Campaign[];
  }

  const ActiveCampaignsSection: React.FC<CampaignsSectionProps> = ({ campaigns }) => (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">3 Active Campaigns</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaigns.map((campaign, index) => (
          <CampaignCard key={index} {...campaign} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="container mx-auto my-8">
      <Header />
      <ActiveCampaignsSection campaigns={campaigns} />
      {/* <PopularCampaignsSection campaigns={popularCampaigns} /> */}
    </div>
    // <div>
    //   <button onClick={handleCreate}>Create</button>
    //   <button onClick={handleDonate}>Donate</button>
    //   <button onClick={handleWithdraw}>Withdraw</button>
    //   <button onClick={handleGet}>Get</button>
    // </div>
  );
};
