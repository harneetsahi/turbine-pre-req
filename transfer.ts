import {
  Transaction,
  Connection,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));

const to = new PublicKey("2Q5nroNBxBugWxs481ijAopoPDi2c3nxWwHAYMKzV988");

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const transaction = new Transaction();

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: LAMPORTS_PER_SOL / 100,
      })
    );

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;

    transaction.feePayer = from.publicKey;

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);

    console.log(
      `Tranfer successful:
      https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (error) {
    console.error("Something went wrong ", error);
  }
})();

(async () => {
  try {
    const balance = await connection.getBalance(from.publicKey);

    const transaction = new Transaction();

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,
      })
    );

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;

    transaction.feePayer = from.publicKey;

    const fee =
      (
        await connection.getFeeForMessage(
          transaction.compileMessage(),
          "confirmed"
        )
      ).value || 0;

    transaction.instructions.pop();

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);

    console.log(
      `Complete transfer successful: https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (error) {
    console.error("Something went wrong ", error);
  }
})();
