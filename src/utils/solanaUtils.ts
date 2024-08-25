// import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
// import { WalletContextState } from '@solana/wallet-adapter-react';

// const DEVNET_ENDPOINT = 'https://api.devnet.solana.com';
// const connection = new Connection(DEVNET_ENDPOINT);

// export const flipCoin = async (): Promise<'heads' | 'tails'> => {
//   return Math.random() < 0.5 ? 'heads' : 'tails';
// };

// export const transferTokens = async (wallet: WalletContextState, amount: number) => {
//   if (!wallet.publicKey || !wallet.signTransaction) {
//     throw new Error('Wallet not connected');
//   }

//   const transaction = new Transaction().add(
//     SystemProgram.transfer({
//       fromPubkey: wallet.publicKey,
//       toPubkey: new PublicKey('Ax86qxLUnpV51EgV74EVpEscjcQh4QY6JDi4eL8GHYr4'), // Replace with your receiving address
//       lamports: amount * LAMPORTS_PER_SOL,
//     })
//   );

//   try {
//     const signature = await wallet.sendTransaction(transaction, connection);
//     await connection.confirmTransaction(signature, 'confirmed');
//     console.log(`Transfer successful: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
//     return signature;
//   } catch (error) {
//     console.error('Error transferring tokens:', error);
//     throw error;
//   }
// };

// export const getBalance = async (publicKey: PublicKey): Promise<number> => {
//   const balance = await connection.getBalance(publicKey);
//   return balance / LAMPORTS_PER_SOL;
// };

// export const requestAirdrop = async (publicKey: PublicKey) => {
//   try {
//     const signature = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
//     await connection.confirmTransaction(signature, 'confirmed');
//     console.log(`Airdrop successful: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
//     return signature;
//   } catch (error) {
//     console.error('Error requesting airdrop:', error);
//     throw error;
//   }
// };






import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

const DEVNET_ENDPOINT = 'https://api.devnet.solana.com';
const connection = new Connection(DEVNET_ENDPOINT);

// This address will act as the "house" for the game
const HOUSE_ADDRESS = new PublicKey('Ax86qxLUnpV51EgV74EVpEscjcQh4QY6JDi4eL8GHYr4');

export const flipCoin = (): 'heads' | 'tails' => {
  return Math.random() < 0.5 ? 'heads' : 'tails';
};

export const transferTokens = async (wallet: WalletContextState, amount: number, isWin: boolean) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: isWin ? HOUSE_ADDRESS : wallet.publicKey,
      toPubkey: isWin ? wallet.publicKey : HOUSE_ADDRESS,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  try {
    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    console.log(`Transfer successful: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    return signature;
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

export const getBalance = async (publicKey: PublicKey): Promise<number> => {
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
};

export const requestAirdrop = async (publicKey: PublicKey) => {
  try {
    const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature, 'confirmed');
    console.log(`Airdrop successful: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    return signature;
  } catch (error) {
    console.error('Error requesting airdrop:', error);
    throw error;
  }
};