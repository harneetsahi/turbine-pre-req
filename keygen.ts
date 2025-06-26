import { Keypair } from "@solana/web3.js";

let kp = Keypair.generate();
console.log(`new solana wallet ${kp.publicKey.toBase58()}`);
