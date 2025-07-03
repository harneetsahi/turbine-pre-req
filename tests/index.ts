import bs58 from "bs58";
import promptSync from "prompt-sync";
import wallet from "../test-wallet.json";

function base58ToWallet() {
  console.log("Enter a base58 string or simply your name");

  const promptInput = promptSync();
  const input: string = promptInput("");

  try {
    const wallet = bs58.decode(input);
    console.log("Decoded wallet ", wallet);
  } catch (error) {
    console.error("Error while decoding the base58 string ", error);
  }
}

base58ToWallet();

function walletToBase58() {
  try {
    const base58 = bs58.encode(wallet);
    console.log("Encoded base58 ", base58);
  } catch (error) {
    console.error("Error while decoding the wallet ", error);
  }
}

walletToBase58();
