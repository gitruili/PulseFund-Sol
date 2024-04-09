import React, { FormEvent, useState } from 'react';
import { PublicKey, Transaction, SystemProgram, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import idl from "../../idl/idl.json";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from "@project-serum/anchor";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface CampaignFormState {
  name: string;
  description: string;
  targetAmount: number;
  projectUrl: string;
  progressUpdateUrl: string;
  projectImageUrl: string;
  category: string;
}

export const CampaignForm: React.FC = () => {
  const [formState, setFormState] = useState<CampaignFormState>({
    name: "",
    description: "",
    targetAmount: 0,
    projectUrl: "",
    progressUpdateUrl: "",
    projectImageUrl: "",
    category: "",
  });

  const wallet = useWallet();
  const { connection } = useConnection();

  // const connection = new Connection('https://api.devnet.solana.com');
  const programId = new PublicKey(idl.metadata.address);

  const createCampaign = async (formState: CampaignFormState) => {
    try {
      const provider = new anchor.AnchorProvider(connection, wallet, {});
      const program = new anchor.Program(idl as anchor.Idl, programId, provider);
      // const newKey = anchor.web3.Keypair.generate();
      // connection.requestAirdrop(newKey.publicKey, 2*anchor.web3.LAMPORTS_PER_SOL)

      const [campaign] = await PublicKey.findProgramAddress(
        [ 
          // utils.bytes.utf8.encode("PROJECT_CROWDFUND"),
          Buffer.from("CROWDFUND"),
          // newKey.publicKey.toBuffer()
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId,
      );
      console.log('campaign pk',campaign.toBase58())
      const tx = await program.rpc.create(
        formState.name, //"123-test",
        formState.description, //"Description of the Campaign",
        new BN(formState.targetAmount), //new BN(1000), // target_amount
        formState.projectUrl, //"Project Url", // project_url
        formState.progressUpdateUrl, //"Project Update Url", // progress_update_url
        formState.projectImageUrl, //"Project Image Url", // project_image_url
        formState.category, //"Technology", // category
        {
          accounts: {
            campaign,
            user: provider.wallet.publicKey,
            // user: newKey.publicKey,
            systemProgram: SystemProgram.programId,
          },
        },
      );
      console.log("Your createCampaign transaction signature", tx);
    } catch (error) {
      console.error("Error creating campaign account:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('Form submission:', formState);
    createCampaign(formState);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Start a Campaign</h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        {/* ... other input fields ... */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Project Name
          </label>
          <input
            id="name"
            name="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter name about idea of startup"
            value={formState.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter Short Description about idea of startup"
            value={formState.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="projectUrl" className="block text-gray-700 text-sm font-bold mb-2">
            Project Url
          </label>
          <input
            id="projectUrl"
            name="projectUrl"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter projectUrl about idea of startup"
            value={formState.projectUrl}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <input
            id="category"
            name="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter category about idea of startup"
            value={formState.category}
            onChange={handleChange}
          />
        </div>
        {/* ... Repeat similar structure for each field ... */}
        <div className="mb-4">
          <label htmlFor="targetAmount" className="block text-gray-700 text-sm font-bold mb-2">
            Goal Amount
          </label>
          <input
            id="targetAmount"
            name="targetAmount"
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Goal Amount"
            value={formState.targetAmount}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Publish Campaign
          </button>
        </div>
      </form>
    </div>
  );
};
