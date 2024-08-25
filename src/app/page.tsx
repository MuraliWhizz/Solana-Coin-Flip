import WalletConnect from './WalletConnect';
import CoinFlip from './CoinFlip';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-8">Solana Coin Flip</h1>
      <WalletConnect />
      <CoinFlip />
    </main>
  );
}