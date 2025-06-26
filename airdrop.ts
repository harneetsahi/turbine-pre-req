import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const transactionHash = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );

    console.log(
      `Airdrop successful. Here is your transaction :  https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`
    );
  } catch (error) {
    console.error("Something went wrong: ", error);
  }
})();
