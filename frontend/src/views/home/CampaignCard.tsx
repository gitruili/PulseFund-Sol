// CampaignCard.tsx
import React from 'react';

import * as anchor from "@coral-xyz/anchor";
// import { DeAnnoTokenProgram } from 'models/de_anno_token_program';
import { assert } from "chai"
import { PublicKey, Transaction, SystemProgram, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import idl from "../../idl/idl.json";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from "@project-serum/anchor";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface CampaignCardProps {
  name: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  investorsCount: number;
  remainingDays: number;
  imageUrl: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  name,
  description,
  goalAmount,
  raisedAmount,
  investorsCount,
  remainingDays,
  imageUrl,
}) => {
    const wallet = useWallet();
    const { connection } = useConnection();
  
    // const connection = new Connection('https://api.devnet.solana.com');
    const programId = new PublicKey(idl.metadata.address);
    
    const donateToCampaign = async () => {
        // this can be passed by a button click, so user can donate.
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
      
          const tx = await program.rpc.donate(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
            accounts: {
              campaign: campaign,
              user: provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
          });
          console.log("Your donateToCampaign transaction signature", tx);
        } catch (error) {
          console.error("Error donating to campaign:", error);
        }
    };

    const handleDonate = () => {
        donateToCampaign();
    }

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg border border-white p-5">
        <img className="w-full" src={'./solanaLogo.png'} alt={name} />
        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{name}</div>
            <p className="text-gray-100 text-base">
            {description}
            </p>
        </div>
        <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Raised ${raisedAmount} of ${goalAmount}</span>
            {/* <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Investor {investorsCount}</span> */}
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Remaining Days {remainingDays}</span>
        </div>
        <div className="flex justify-between px-6 pt-4">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded text-xs">Details</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs" onClick={handleDonate}>Contribute</button>
        </div>
        </div>
    );
};

export default CampaignCard;
