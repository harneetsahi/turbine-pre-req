import { Idl } from "@coral-xyz/anchor";
import bs58 from "bs58";

import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL } from "./programs/Turbin3 _prereq";
import wallet from "./Turbin3-wallet.json";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

const decodedKey = bs58.decode(wallet);
const keypair = Keypair.fromSecretKey(decodedKey);

const connection = new Connection("https://api.devnet.solana.com");

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const program: Program<Idl> = new Program(IDL, provider);

const account_seeds = [Buffer.from("prereqs"), keypair.publicKey.toBuffer()];

const [account_key, _account_bump] = PublicKey.findProgramAddressSync(
  account_seeds,
  program.programId
);

const mintCollection = new PublicKey(
  "5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2"
);

const mintTs = Keypair.generate();

const authority_seeds = [Buffer.from("collection"), mintCollection.toBuffer()];
const [authority_key, _authority_bump] = PublicKey.findProgramAddressSync(
  authority_seeds,
  program.programId
);

(async () => {
  try {
    const transactionHash = await program.methods
      .initialize("harneetsahi")
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        system_program: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    console.log(
      `Successful: https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`
    );
  } catch (error) {
    console.error("Something went wrong ", error);
  }
})();

(async () => {
  try {
    const transactionHash = await program.methods
      .submitTs()
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        mint: mintTs.publicKey,
        collection: mintCollection,
        authority: authority_key,
        mpl_core_program: MPL_CORE_PROGRAM_ID,
        system_program: SystemProgram.programId,
      })
      .signers([keypair, mintTs])
      .rpc();

    console.log(
      `Successful: https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`
    );
  } catch (error) {
    console.error("Something went wrong ", error);
  }
})();
